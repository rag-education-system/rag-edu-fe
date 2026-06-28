<script lang="ts">
	import { ChatContainer, ChatInput, ChatModeSelector, DocumentPreviewPanel } from '$lib/components/chat';
	import type { ChatMessageData } from '$lib/components/chat';
	import type { QuerySourceDto } from '$lib/types/api';
	import type { DocumentItemDto } from '$lib/types/api';
	import type { SourcePreviewSelection } from '$lib/types/document-preview';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { chatStore } from '$lib/stores/chat.svelte';
	import { createStreamController } from '$lib/utils/sse';

	let messages = $state<ChatMessageData[]>([]);
	let isLoading = $state(false);
	let streamStatus = $state('');
	let inputValue = $state('');
	let previewOpen = $state(false);
	let previewLoading = $state(false);
	let previewError = $state('');
	let previewDocument = $state<DocumentItemDto | null>(null);
	let selectedSource = $state<SourcePreviewSelection | null>(null);
	let abortController = $state<AbortController | null>(null);
	let previousActiveId: string | null = null;

	const activeTitle = $derived(chatStore.activeConversation?.title ?? 'Chat Baru');
	const focusedDocName = $derived.by(() => {
		const conv = chatStore.activeConversation;
		if (!conv?.documentId) return null;
		const prefix = 'Tanya: ';
		if (conv.title?.startsWith(prefix)) return conv.title.slice(prefix.length);
		return 'Dokumen terfokus';
	});
	const isSelectingConversation = $derived(
		Boolean(chatStore.activeId && chatStore.selectingConversationId === chatStore.activeId)
	);
	const showChatLoading = $derived(isLoading || isSelectingConversation);

	$effect(() => {
		if (!browser || !chatStore.activeId) return;
		messages = [...chatStore.activeMessages];
	});

	// Hentikan stream lama saat pengguna pindah riwayat chat (bukan saat draft dipromosikan).
	$effect(() => {
		if (!browser) return;
		const activeId = chatStore.activeId;

		if (
			previousActiveId &&
			activeId &&
			previousActiveId !== activeId &&
			!previousActiveId.startsWith('draft-') &&
			isLoading
		) {
			abortController?.abort();
			abortController = null;
			isLoading = false;
			streamStatus = '';
		}

		previousActiveId = activeId;
	});

	$effect(() => {
		return () => {
			abortController?.abort();
		};
	});

	function generateId(): string {
		return Date.now().toString(36) + Math.random().toString(36).slice(2);
	}

	function persistMessages(nextMessages: ChatMessageData[], targetId?: string) {
		messages = nextMessages;
		chatStore.saveMessages(nextMessages, targetId);
	}

	async function handleSourceSelect(source: QuerySourceDto) {
		if (!source.documentId) {
			toast.error('Dokumen sumber tidak ditemukan');
			return;
		}

		selectedSource = {
			documentId: source.documentId,
			pageNumber: source.pageNumber,
			similarity: source.similarity,
			snippet: source.content
		};
		previewOpen = true;
		previewLoading = true;
		previewError = '';
		previewDocument = null;

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000);

			const response = await fetch(`/api/documents/${source.documentId}`, {
				signal: controller.signal
			});
			clearTimeout(timeoutId);

			const result = await response.json();

			if (response.status === 401) {
				toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
				goto('/auth/login?redirect=/chat');
				return;
			}

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Gagal memuat dokumen');
			}

			previewDocument = result.data as DocumentItemDto;
		} catch (error) {
			previewError = error instanceof Error ? error.message : 'Gagal memuat dokumen';
			toast.error(previewError);
		} finally {
			previewLoading = false;
		}
	}

	function closePreview() {
		previewOpen = false;
		previewError = '';
	}

	async function handleSubmit(message: string) {
		if (!message.trim() || isLoading) return;

		if (!chatStore.activeId) {
			chatStore.createNewChat();
		}

		const streamTargetId = chatStore.activeId!;
		let currentStreamId = streamTargetId;

		abortController?.abort();
		abortController = createStreamController();

		const userMessage: ChatMessageData = {
			id: generateId(),
			role: 'user',
			content: message,
			timestamp: new Date()
		};

		const nextMessages = [...messages, userMessage];
		persistMessages(nextMessages, currentStreamId);
		inputValue = '';
		isLoading = true;
		streamStatus = 'Memproses pertanyaan...';

		const assistantPlaceholder: ChatMessageData = {
			id: generateId(),
			role: 'assistant',
			content: '',
			sources: [],
			timestamp: new Date()
		};
		persistMessages([...nextMessages, assistantPlaceholder], currentStreamId);

		try {
			const result = await chatStore.sendMessageStream(
				message,
				{
					onConversationId: (id) => {
						currentStreamId = id;
						replaceState(`/chat?id=${id}`, $page.state);
						void chatStore.loadFromServer();
					},
					onToken: (token) => {
						assistantPlaceholder.content += token;
						persistMessages([...nextMessages, { ...assistantPlaceholder }], currentStreamId);
					},
					onSources: (sources) => {
						assistantPlaceholder.sources = sources;
						persistMessages([...nextMessages, { ...assistantPlaceholder }], currentStreamId);
					},
					onStatus: (status) => {
						streamStatus = status;
					}
				},
				{ signal: abortController.signal, streamTargetId }
			);

			if (!result) {
				throw new Error('Gagal mendapatkan jawaban');
			}

			persistMessages([...nextMessages, result.assistantMessage], result.conversationId);
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') return;

			const errMsg = error instanceof Error ? error.message : 'Gagal mendapatkan jawaban';
			if (errMsg.includes('Session expired') || errMsg.includes('Unauthorized')) {
				toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
				goto('/auth/login?redirect=/chat');
				return;
			}
			toast.error(errMsg);
			persistMessages(
				nextMessages.filter((m) => m.id !== userMessage.id),
				currentStreamId
			);
		} finally {
			isLoading = false;
			streamStatus = '';
			abortController = null;
		}
	}

	function handleQuickAction(action: string) {
		inputValue = action;
	}
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-background via-background to-emerald-950/10 lg:flex-row">
	<section
		class="flex min-h-0 min-w-0 flex-1 flex-col {previewOpen ? 'hidden lg:flex' : 'flex'}"
		aria-label="Area chat"
	>
		<div class="hidden shrink-0 items-center justify-between gap-3 border-b border-border/50 px-6 py-4 lg:flex">
			<div class="min-w-0">
				<h1 class="max-w-xl truncate text-lg font-semibold text-foreground">{activeTitle}</h1>
				<p class="text-sm text-muted-foreground">Ajukan pertanyaan berdasarkan dokumen Anda</p>
			</div>
			{#if focusedDocName}
				<Badge variant="secondary" class="max-w-xs shrink-0 gap-1.5">
					<svg
						class="h-3.5 w-3.5 shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<span class="truncate">{focusedDocName}</span>
				</Badge>
			{/if}
		</div>

		<ChatContainer
			{messages}
			isLoading={showChatLoading}
			streamStatus={isSelectingConversation ? 'Memuat riwayat chat...' : streamStatus}
			onQuickAction={handleQuickAction}
			onSourceSelect={handleSourceSelect}
		/>

		<div class="shrink-0 space-y-2 border-t border-border/30 bg-background/80 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
			<ChatModeSelector
				mode={chatStore.chatMode}
				disabled={showChatLoading}
				onChange={(mode) => chatStore.setChatMode(mode)}
			/>
			<ChatInput
				bind:value={inputValue}
				placeholder="Tanyakan sesuatu..."
				loading={showChatLoading}
				disabled={showChatLoading}
				onsubmit={handleSubmit}
			/>
		</div>
	</section>

	<DocumentPreviewPanel
		open={previewOpen}
		loading={previewLoading}
		error={previewError}
		document={previewDocument}
		highlightPageNumber={selectedSource?.pageNumber ?? 1}
		highlightSnippet={selectedSource?.snippet}
		onClose={closePreview}
	/>
</div>

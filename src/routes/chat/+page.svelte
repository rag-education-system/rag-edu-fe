<script lang="ts">
	import { ChatContainer, ChatInput, DocumentPreviewPanel } from '$lib/components/chat';
	import type { ChatMessageData } from '$lib/components/chat';
	import type { QuerySourceDto } from '$lib/types/api';
	import type { DocumentItemDto } from '$lib/types/api';
	import type { SourcePreviewSelection } from '$lib/types/document-preview';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { chatStore } from '$lib/stores/chat.svelte';
	import { createStreamController } from '$lib/utils/sse';

	let messages = $state<ChatMessageData[]>([]);
	let isLoading = $state(false);
	let inputValue = $state('');
	let previewOpen = $state(false);
	let previewLoading = $state(false);
	let previewError = $state('');
	let previewDocument = $state<DocumentItemDto | null>(null);
	let selectedSource = $state<SourcePreviewSelection | null>(null);
	let abortController = $state<AbortController | null>(null);

	const activeTitle = $derived(chatStore.activeConversation?.title ?? 'Chat Baru');

	$effect(() => {
		const activeId = chatStore.activeId;
		if (!browser || !activeId) return;

		untrack(() => {
			messages = chatStore.activeMessages;
			inputValue = '';
		});
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
		<div class="hidden shrink-0 items-center justify-between border-b border-border/50 px-6 py-4 lg:flex">
			<div class="min-w-0">
				<h1 class="max-w-xl truncate text-lg font-semibold text-foreground">{activeTitle}</h1>
				<p class="text-sm text-muted-foreground">Ajukan pertanyaan berdasarkan dokumen Anda</p>
			</div>
		</div>

		<ChatContainer {messages} {isLoading} onQuickAction={handleQuickAction} onSourceSelect={handleSourceSelect} />

		<div class="shrink-0 border-t border-border/30 bg-background/80 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
			<ChatInput
				bind:value={inputValue}
				placeholder="Tanyakan sesuatu..."
				loading={isLoading}
				disabled={isLoading}
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

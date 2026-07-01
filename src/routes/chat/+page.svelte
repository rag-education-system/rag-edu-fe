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
	import { onMount } from 'svelte';
	import { chatStore } from '$lib/stores/chat.svelte';
	import { createStreamController } from '$lib/utils/sse';

	const PREVIEW_MIN_WIDTH = 320;
	const PREVIEW_MAX_WIDTH_RATIO = 0.75;
	const PREVIEW_DEFAULT_WIDTH = 480;
	const PREVIEW_WIDTH_STORAGE_KEY = 'chat-preview-panel-width';

	let messages = $state<ChatMessageData[]>([]);
	let isLoading = $state(false);
	let isStreaming = $state(false);
	let streamStatus = $state('');
	let inputValue = $state('');
	let previewOpen = $state(false);
	let previewLoading = $state(false);
	let previewError = $state('');
	let previewDocument = $state<DocumentItemDto | null>(null);
	let selectedSource = $state<SourcePreviewSelection | null>(null);
	let previewPanelWidth = $state(PREVIEW_DEFAULT_WIDTH);
	let isResizingPreview = $state(false);
	let abortController = $state<AbortController | null>(null);
	let previousActiveId: string | null = null;

	// Penghitung waktu tunggu sebelum token pertama jawaban AI muncul.
	let waitSeconds = $state(0);
	let waitTimer: ReturnType<typeof setInterval> | null = null;

	function startWaitTimer() {
		stopWaitTimer();
		waitSeconds = 0;
		const startedAt = performance.now();
		waitTimer = setInterval(() => {
			waitSeconds = (performance.now() - startedAt) / 1000;
		}, 100);
	}

	function stopWaitTimer() {
		if (waitTimer) {
			clearInterval(waitTimer);
			waitTimer = null;
		}
	}

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
	const showChatLoading = $derived(isSelectingConversation || isStreaming);

	// Jangan timpa pesan lokal saat stream aktif — hindari flicker dari loadFromServer / promote draft.
	$effect(() => {
		if (!browser) return;
		const activeId = chatStore.activeId;
		const storeMessages = chatStore.activeMessages;
		if (!activeId) {
			if (!isLoading) messages = [];
			return;
		}
		if (!isLoading && !isStreaming) {
			messages = [...storeMessages];
		}
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
			isStreaming = false;
			streamStatus = '';
			stopWaitTimer();
		}

		previousActiveId = activeId;
	});

	$effect(() => {
		return () => {
			abortController?.abort();
			stopWaitTimer();
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
		isStreaming = true;
		streamStatus = 'Mencari konteks dokumen...';
		startWaitTimer();

		const assistantId = generateId();
		const assistantPlaceholder: ChatMessageData = {
			id: assistantId,
			role: 'assistant',
			content: '',
			sources: [],
			timestamp: new Date()
		};
		persistMessages([...nextMessages, assistantPlaceholder], currentStreamId);

		const authToken = $page.data.token;

		try {
			const result = await chatStore.sendMessageStream(
				message,
				{
					onConversationId: (id) => {
						currentStreamId = id;
						replaceState(`/chat?id=${id}`, $page.state);
					},
					onToken: (token) => {
						stopWaitTimer();
						streamStatus = '';
						isLoading = false;
						messages = messages.map((entry) =>
							entry.id === assistantId ? { ...entry, content: entry.content + token } : entry
						);
					},
					onSources: (sources) => {
						messages = messages.map((entry) =>
							entry.id === assistantId ? { ...entry, sources } : entry
						);
						chatStore.saveMessages(messages, currentStreamId);
					},
					onStatus: (status) => {
						streamStatus = status;
					}
				},
				{ signal: abortController.signal, streamTargetId, authToken }
			);

			if (!result) {
				throw new Error('Gagal mendapatkan jawaban');
			}

			messages = messages.map((entry) =>
				entry.id === assistantId ? result.assistantMessage : entry
			);
			chatStore.saveMessages(messages, result.conversationId);
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
			stopWaitTimer();
			isLoading = false;
			isStreaming = false;
			streamStatus = '';
			abortController = null;
			void chatStore.loadFromServer();
		}
	}

	function handleQuickAction(action: string) {
		inputValue = action;
	}

	function clampPreviewWidth(width: number) {
		if (!browser) return width;
		const max = Math.floor(window.innerWidth * PREVIEW_MAX_WIDTH_RATIO);
		return Math.min(Math.max(width, PREVIEW_MIN_WIDTH), max);
	}

	function startPreviewResize(event: PointerEvent) {
		event.preventDefault();
		isResizingPreview = true;

		const startX = event.clientX;
		const startWidth = previewPanelWidth;

		const onMove = (moveEvent: PointerEvent) => {
			moveEvent.preventDefault();
			const delta = startX - moveEvent.clientX;
			previewPanelWidth = clampPreviewWidth(startWidth + delta);
		};

		const onEnd = () => {
			isResizingPreview = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onEnd);
			window.removeEventListener('pointercancel', onEnd);
			if (browser) {
				localStorage.setItem(PREVIEW_WIDTH_STORAGE_KEY, String(previewPanelWidth));
			}
		};

		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onEnd);
		window.addEventListener('pointercancel', onEnd);
	}

	onMount(() => {
		const stored = localStorage.getItem(PREVIEW_WIDTH_STORAGE_KEY);
		if (stored) {
			const parsed = Number(stored);
			if (!Number.isNaN(parsed)) {
				previewPanelWidth = clampPreviewWidth(parsed);
			}
		}

		const handleWindowResize = () => {
			previewPanelWidth = clampPreviewWidth(previewPanelWidth);
		};
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});
</script>

<div class="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-background via-background to-emerald-950/10 lg:flex-row">
	<section
		class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden {previewOpen ? 'hidden lg:flex' : 'flex'}"
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
			{isStreaming}
			streamStatus={isSelectingConversation ? 'Memuat riwayat chat...' : streamStatus}
			waitSeconds={isSelectingConversation ? 0 : waitSeconds}
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

	{#if previewOpen}
		<div
			role="separator"
			aria-orientation="vertical"
			aria-label="Ubah ukuran panel preview"
			class="relative hidden shrink-0 touch-none select-none lg:block {isResizingPreview
				? 'bg-primary/30'
				: 'bg-border/50 hover:bg-primary/20'}"
			style="width: 10px; cursor: col-resize"
			onpointerdown={startPreviewResize}
		>
			<div
				class="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1"
				aria-hidden="true"
			>
				<span class="h-1 w-1 rounded-full bg-muted-foreground/60"></span>
				<span class="h-1 w-1 rounded-full bg-muted-foreground/60"></span>
				<span class="h-1 w-1 rounded-full bg-muted-foreground/60"></span>
			</div>
		</div>
	{/if}

	<DocumentPreviewPanel
		open={previewOpen}
		width={previewPanelWidth}
		loading={previewLoading}
		error={previewError}
		document={previewDocument}
		highlightPageNumber={selectedSource?.pageNumber ?? 1}
		highlightSnippet={selectedSource?.snippet}
		onClose={closePreview}
	/>
</div>

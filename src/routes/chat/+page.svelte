<script lang="ts">
	import { ChatContainer, ChatInput, DocumentPreviewPanel } from '$lib/components/chat';
	import type { ChatMessageData } from '$lib/components/chat';
	import type { QuerySourceDto } from '$lib/types/api';
	import type { DocumentPreviewData, SourcePreviewSelection } from '$lib/types/document-preview';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { chatStore } from '$lib/stores/chat.svelte';

	let messages = $state<ChatMessageData[]>([]);
	let isLoading = $state(false);
	let inputValue = $state('');
	let previewOpen = $state(false);
	let previewLoading = $state(false);
	let previewError = $state('');
	let previewData = $state<DocumentPreviewData | null>(null);
	let selectedSource = $state<SourcePreviewSelection | null>(null);

	const activeTitle = $derived(chatStore.activeConversation?.title ?? 'Chat Baru');

	$effect(() => {
		const activeId = chatStore.activeId;
		if (!browser || !activeId) return;
		messages = chatStore.activeMessages;
		inputValue = '';
		isLoading = false;
	});

	function generateId(): string {
		return Date.now().toString(36) + Math.random().toString(36).slice(2);
	}

	function persistMessages(nextMessages: ChatMessageData[]) {
		messages = nextMessages;
		chatStore.saveMessages(nextMessages);
	}

	async function handleSourceSelect(source: QuerySourceDto) {
		if (!source.documentId) {
			toast.error('Dokumen sumber tidak ditemukan');
			return;
		}

		selectedSource = {
			documentId: source.documentId,
			chunkIndex: source.chunkIndex ?? 0,
			similarity: source.similarity,
			snippet: source.content
		};
		previewOpen = true;
		previewLoading = true;
		previewError = '';
		previewData = null;

		try {
			const response = await fetch(`/api/documents/${source.documentId}/chunks`);
			const result = await response.json();

			if (response.status === 401) {
				toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
				goto('/auth/login?redirect=/chat');
				return;
			}

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Gagal memuat preview dokumen');
			}

			previewData = result.data as DocumentPreviewData;
		} catch (error) {
			previewError = error instanceof Error ? error.message : 'Gagal memuat preview dokumen';
			toast.error(previewError);
		} finally {
			previewLoading = false;
		}
	}

	function closePreview() {
		previewOpen = false;
		previewError = '';
	}

	function buildChatHistory(sourceMessages: ChatMessageData[]) {
		return sourceMessages.slice(-10).map((message) => ({
			role: message.role,
			content: message.content
		}));
	}

	async function handleSubmit(message: string) {
		if (!message.trim() || isLoading) return;

		if (!chatStore.activeId) {
			chatStore.createNewChat();
		}

		const userMessage: ChatMessageData = {
			id: generateId(),
			role: 'user',
			content: message,
			timestamp: new Date()
		};

		const nextMessages = [...messages, userMessage];
		persistMessages(nextMessages);
		inputValue = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: message,
					history: buildChatHistory(messages)
				})
			});

			const result = await response.json();

			if (response.status === 401) {
				toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
				goto('/auth/login?redirect=/chat');
				return;
			}

			if (!response.ok) {
				throw new Error(result.error || 'Gagal mendapatkan jawaban');
			}

			if (result.success && result.data) {
				const aiMessage: ChatMessageData = {
					id: generateId(),
					role: 'assistant',
					content: result.data.answer,
					sources: result.data.sources || [],
					timestamp: new Date()
				};
				persistMessages([...nextMessages, aiMessage]);
			}
		} catch (error) {
			console.error('[CHAT] Error:', error);
			toast.error(error instanceof Error ? error.message : 'Gagal mendapatkan jawaban');
			persistMessages(nextMessages.filter((message) => message.id !== userMessage.id));
		} finally {
			isLoading = false;
		}
	}

	function handleQuickAction(action: string) {
		inputValue = action;
	}
</script>

<div class="h-[calc(100vh-57px)] lg:h-screen flex overflow-hidden bg-gradient-to-b from-background via-background to-emerald-950/10">
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="shrink-0 hidden lg:flex items-center justify-between px-6 py-4 border-b border-border/50">
			<div>
				<h1 class="text-lg font-semibold text-foreground truncate max-w-xl">{activeTitle}</h1>
				<p class="text-sm text-muted-foreground">Ajukan pertanyaan berdasarkan dokumen Anda</p>
			</div>
		</div>

		<ChatContainer {messages} {isLoading} onQuickAction={handleQuickAction} onSourceSelect={handleSourceSelect} />

		<div class="shrink-0 px-4 pb-6 pt-2">
			<ChatInput
				bind:value={inputValue}
				placeholder="Tanyakan sesuatu tentang dokumen Anda..."
				loading={isLoading}
				disabled={isLoading}
				onsubmit={handleSubmit}
			/>
		</div>
	</div>

	<DocumentPreviewPanel
		open={previewOpen}
		loading={previewLoading}
		error={previewError}
		preview={previewData}
		highlightChunkIndex={selectedSource?.chunkIndex ?? 0}
		onClose={closePreview}
	/>
</div>

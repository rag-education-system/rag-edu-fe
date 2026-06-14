<script lang="ts">
	import { ChatContainer, ChatInput } from '$lib/components/chat';
	import type { ChatMessageData } from '$lib/components/chat';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	const STORAGE_KEY = 'chat_history';

	let messages = $state<ChatMessageData[]>([]);
	let isLoading = $state(false);
	let inputValue = $state('');

	// Load messages from localStorage on mount
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					messages = parsed.messages.map((m: ChatMessageData) => ({
						...m,
						timestamp: new Date(m.timestamp)
					}));
				} catch {
					messages = [];
				}
			}
		}
	});

	function saveMessages() {
		if (browser && messages.length > 0) {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					messages,
					lastUpdated: new Date().toISOString()
				})
			);
		}
	}

	function generateId(): string {
		return Date.now().toString(36) + Math.random().toString(36).slice(2);
	}

	async function handleSubmit(message: string) {
		if (!message.trim() || isLoading) return;

		const userMessage: ChatMessageData = {
			id: generateId(),
			role: 'user',
			content: message,
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		inputValue = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query: message })
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
				messages = [...messages, aiMessage];
				saveMessages();
			}
		} catch (error) {
			console.error('[CHAT] Error:', error);
			toast.error(error instanceof Error ? error.message : 'Gagal mendapatkan jawaban');
			messages = messages.filter((m) => m.id !== userMessage.id);
		} finally {
			isLoading = false;
		}
	}

	function handleQuickAction(action: string) {
		inputValue = action;
	}

	function clearHistory() {
		messages = [];
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
		toast.success('Riwayat chat berhasil dihapus');
	}
</script>

<div class="h-screen flex flex-col bg-gradient-to-b from-background via-background to-emerald-950/10">
	<div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border/50">
		<div>
			<h1 class="text-lg font-semibold text-foreground">Tanya AI</h1>
			<p class="text-sm text-muted-foreground">Ajukan pertanyaan berdasarkan dokumen Anda</p>
		</div>

		{#if messages.length > 0}
			<button
				type="button"
				onclick={clearHistory}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/50 border border-border/50 transition-all duration-200"
				aria-label="Hapus riwayat chat"
			>
				{@render TrashIcon()}
				<span class="hidden sm:inline">Hapus Riwayat</span>
			</button>
		{/if}
	</div>

	<!-- Chat container -->
	<ChatContainer {messages} {isLoading} onQuickAction={handleQuickAction} />

	<!-- Input area - no border, cleaner look -->
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

{#snippet TrashIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
	</svg>
{/snippet}

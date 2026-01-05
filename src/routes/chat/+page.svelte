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
	let modelDropdownOpen = $state(false);
	let selectedModel = $state('RAG v1.0');

	const models = ['RAG v1.0', 'RAG v2.0 (Beta)', 'Custom Model'];

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
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

	function selectModel(model: string) {
		selectedModel = model;
		modelDropdownOpen = false;
	}
</script>

{#snippet ChevronDownIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
	</svg>
{/snippet}

{#snippet SettingsIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
	</svg>
{/snippet}

{#snippet ExportIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
	</svg>
{/snippet}

{#snippet TrashIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
	</svg>
{/snippet}

<div class="h-screen flex flex-col bg-gradient-to-b from-background via-background to-emerald-950/10">
	<!-- Header - Matching reference design -->
	<div class="shrink-0 flex items-center justify-between px-6 py-4">
		<!-- Left side - Model selector -->
		<div class="relative">
			<button
				type="button"
				onclick={() => (modelDropdownOpen = !modelDropdownOpen)}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/50 hover:bg-card/70 hover:border-border transition-all duration-200"
			>
				<span class="text-sm font-medium text-foreground">{selectedModel}</span>
				{@render ChevronDownIcon()}
			</button>

			<!-- Dropdown -->
			{#if modelDropdownOpen}
				<div class="absolute top-full left-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl z-50">
					{#each models as model}
						<button
							type="button"
							onclick={() => selectModel(model)}
							class="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 first:rounded-t-xl last:rounded-b-xl transition-colors {model === selectedModel ? 'text-primary font-medium' : 'text-foreground'}"
						>
							{model}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right side - Action buttons -->
		<div class="flex items-center gap-2">
			{#if messages.length > 0}
				<button
					type="button"
					onclick={clearHistory}
					class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/50 border border-transparent hover:border-border/50 transition-all duration-200"
					aria-label="Clear history"
				>
					{@render TrashIcon()}
					<span class="hidden sm:inline">Clear</span>
				</button>
			{/if}
			<button
				type="button"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/50 text-sm font-medium text-foreground hover:bg-card/70 transition-all duration-200"
				aria-label="Configuration"
			>
				{@render SettingsIcon()}
				<span class="hidden sm:inline">Configuration</span>
			</button>
			<button
				type="button"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/50 text-sm font-medium text-foreground hover:bg-card/70 transition-all duration-200"
				aria-label="Export"
			>
				{@render ExportIcon()}
				<span class="hidden sm:inline">Export</span>
			</button>
		</div>
	</div>

	<!-- Chat container -->
	<ChatContainer {messages} {isLoading} onQuickAction={handleQuickAction} />

	<!-- Input area - no border, cleaner look -->
	<div class="shrink-0 px-4 pb-6 pt-2">
		<ChatInput
			bind:value={inputValue}
			placeholder="Ask Anything..."
			loading={isLoading}
			disabled={isLoading}
			onsubmit={handleSubmit}
		/>
	</div>
</div>

<!-- Click outside to close dropdown -->
{#if modelDropdownOpen}
	<button
		type="button"
		class="fixed inset-0 z-40"
		onclick={() => (modelDropdownOpen = false)}
		aria-label="Close dropdown"
	></button>
{/if}

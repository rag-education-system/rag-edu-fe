<script lang="ts">
	import type { LayoutData } from './$types';
	import { ChatSidebar } from '$lib/components/chat';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/utils/logout';
	import { chatStore } from '$lib/stores/chat.svelte';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(false);

	$effect(() => {
		if (browser) {
			chatStore.init();
			if (window.innerWidth < 1024) {
				sidebarCollapsed = true;
			}
		}
	});

	function handleNewChat() {
		chatStore.createNewChat();
		goto('/chat');
	}

	function handleSelectConversation(id: string) {
		chatStore.selectConversation(id);
		if (window.innerWidth < 1024) {
			sidebarCollapsed = true;
		}
	}

	function handleDeleteConversation(id: string) {
		chatStore.deleteConversation(id);
	}

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="min-h-screen bg-background">
	<ChatSidebar
		collapsed={sidebarCollapsed}
		conversations={chatStore.historyConversations}
		activeConversationId={chatStore.activeId}
		onNewChat={handleNewChat}
		onSelectConversation={handleSelectConversation}
		onDeleteConversation={handleDeleteConversation}
		onLogout={() => logout()}
	/>

	{#if !sidebarCollapsed}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/50 lg:hidden"
			onclick={() => (sidebarCollapsed = true)}
			aria-label="Tutup sidebar"
		></button>
	{/if}

	<div class="lg:ml-64 min-h-screen transition-all duration-300">
		<main class="relative z-10">
			<div class="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-background/90 backdrop-blur-md">
				<button
					type="button"
					onclick={toggleSidebar}
					class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
					aria-label="Buka menu chat"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<div>
					<p class="text-sm font-semibold text-foreground">Tanya AI</p>
					<p class="text-xs text-muted-foreground">Riwayat & chat baru</p>
				</div>
			</div>

			{@render children()}
		</main>
	</div>
</div>

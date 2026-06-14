<script lang="ts">
	import type { LayoutData } from './$types';
	import { ChatSidebar } from '$lib/components/chat';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/utils/logout';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(false);

	function handleNewChat() {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('chat_history');
		}
		goto('/chat', { invalidateAll: true });
	}
</script>

<div class="min-h-screen bg-background">
	<ChatSidebar
		collapsed={sidebarCollapsed}
		onNewChat={handleNewChat}
		onLogout={() => logout()}
	/>

	{#if !sidebarCollapsed}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/50 lg:hidden"
			onclick={() => (sidebarCollapsed = true)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<div class="lg:ml-64 min-h-screen transition-all duration-300">
		<main>
			{@render children()}
		</main>
	</div>
</div>

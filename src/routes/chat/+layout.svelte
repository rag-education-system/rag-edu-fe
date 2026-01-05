<script lang="ts">
	import type { LayoutData } from './$types';
	import { ChatSidebar } from '$lib/components/chat';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(false);

	function handleNewChat() {
		// Clear chat and refresh page
		if (typeof window !== 'undefined') {
			localStorage.removeItem('chat_history');
		}
		goto('/chat');
		window.location.reload();
	}

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		goto('/auth/login');
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Chat Sidebar -->
	<ChatSidebar collapsed={sidebarCollapsed} onNewChat={handleNewChat} onLogout={handleLogout} />

	<!-- Overlay for mobile -->
	{#if !sidebarCollapsed}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/50 lg:hidden"
			onclick={() => (sidebarCollapsed = true)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<!-- Main Content Area -->
	<div class="lg:ml-64 min-h-screen transition-all duration-300">
		<!-- Page Content -->
		<main>
			{@render children()}
		</main>
	</div>
</div>

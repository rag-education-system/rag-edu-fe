<script lang="ts">
	import type { LayoutData } from './$types';
	import { Sidebar } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(true);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		goto('/auth/login');
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Mobile Menu Toggle -->
	<button
		type="button"
		onclick={toggleSidebar}
		class="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors shadow-sm"
		aria-label="Toggle menu"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>

	<!-- Sidebar -->
	<Sidebar collapsed={sidebarCollapsed} onLogout={handleLogout} user={data.user} />

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
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>

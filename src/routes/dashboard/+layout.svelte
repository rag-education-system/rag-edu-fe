<script lang="ts">
	import type { LayoutData } from './$types';
	import { Sidebar } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { logout } from '$lib/utils/logout';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(true);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="min-h-screen bg-background">
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

	<Sidebar
		collapsed={sidebarCollapsed}
		onLogout={() => logout()}
		user={data.user}
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
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>

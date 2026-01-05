<script lang="ts">
	import type { LayoutData } from './$types';
	import { Sidebar, Topbar } from '$lib/components/layout';
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
	<!-- Sidebar -->
	<Sidebar collapsed={sidebarCollapsed} onLogout={handleLogout} />

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
		<!-- Topbar -->
		<Topbar user={data.user} onMenuToggle={toggleSidebar} />

		<!-- Page Content -->
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>

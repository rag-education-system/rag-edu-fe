<script lang="ts">
	import type { LayoutData } from './$types';
	import { Sidebar, Topbar } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { logout } from '$lib/utils/logout';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(true);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="min-h-screen bg-background">
	<Sidebar collapsed={sidebarCollapsed} onLogout={() => logout()} user={data.user} />

	{#if !sidebarCollapsed}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/50 lg:hidden"
			onclick={() => (sidebarCollapsed = true)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<div class="lg:ml-64 min-h-screen transition-all duration-300">
		<Topbar user={data.user} onMenuToggle={toggleSidebar} />

		<main class="p-4 sm:p-6">
			{@render children()}
		</main>
	</div>
</div>

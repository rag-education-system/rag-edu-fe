<script lang="ts">
	import type { LayoutData } from './$types';
	import { Sidebar, Topbar } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { logout } from '$lib/utils/logout';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(true);
	let isMobile = $state(false);

	$effect(() => {
		if (!browser) return;

		const updateViewport = () => {
			const mobile = window.innerWidth < 1024;
			if (mobile !== isMobile) {
				isMobile = mobile;
				sidebarCollapsed = mobile;
			}
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});

	$effect(() => {
		if (!browser || !isMobile) return;
		void $page.url.pathname;
		void $page.url.search;
		sidebarCollapsed = true;
	});

	function toggleSidebar() {
		if (!isMobile) return;
		sidebarCollapsed = !sidebarCollapsed;
	}

	function closeSidebar() {
		if (!isMobile) return;
		sidebarCollapsed = true;
	}
</script>

<div class="min-h-screen bg-background">
	<Sidebar
		collapsed={sidebarCollapsed}
		onClose={closeSidebar}
		onLogout={() => logout()}
		user={data.user}
	/>

	{#if !sidebarCollapsed && isMobile}
		<button
			type="button"
			class="fixed inset-0 z-30 bg-black/50 lg:hidden"
			onclick={closeSidebar}
			aria-label="Close sidebar"
		></button>
	{/if}

	<div class="min-h-screen transition-[margin] duration-300 lg:ml-52">
		<Topbar user={data.user} onMenuToggle={toggleSidebar} showMenuToggle={isMobile} />

		<main class="p-4 sm:p-6">
			{@render children()}
		</main>
	</div>
</div>

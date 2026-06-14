<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	const tabs = [
		{ href: '/dashboard/admin', label: 'Daftar Pengguna', exact: true },
		{ href: '/dashboard/admin/create', label: 'Buat Akun', exact: false }
	];
</script>

<div class="mx-auto max-w-6xl space-y-6">
	<div>
		<h1 class="text-3xl font-bold">Admin</h1>
		<p class="text-muted-foreground mt-1">
			Kelola pengguna kampus. Pendaftaran mandiri dinonaktifkan.
		</p>
	</div>

	<nav class="flex flex-wrap gap-2 border-b border-border pb-4">
		{#each tabs as tab}
			<a
				href={tab.href}
				class={cn(
					'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
					tab.exact
						? $page.url.pathname === tab.href
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'
						: $page.url.pathname.startsWith(tab.href)
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'
				)}
			>
				{tab.label}
			</a>
		{/each}
	</nav>

	{@render children()}
</div>

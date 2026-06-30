<script lang="ts">
	import { cn } from '$lib/utils';
	import type { DtoUserInfo } from '$lib/api/api';
	import ThemeToggle from './ThemeToggle.svelte';

	let {
		user,
		onMenuToggle,
		showMenuToggle = true,
		class: className
	}: {
		user?: DtoUserInfo;
		onMenuToggle?: () => void;
		showMenuToggle?: boolean;
		class?: string;
	} = $props();

	const displayName = $derived(user?.name ?? 'Pengguna');
	const displayEmail = $derived(user?.email ?? '');

	const initials = $derived(
		displayName
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U'
	);
</script>

<header
	class={cn(
		'sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/50 bg-card/80 px-4 backdrop-blur-xl sm:px-5',
		className
	)}
>
	<div class="flex flex-1 items-center gap-3">
		{#if showMenuToggle}
			<button
				type="button"
				onclick={onMenuToggle}
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
				aria-label="Toggle menu"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		{/if}

		<div class="hidden min-w-0 sm:block">
			<p class="truncate text-sm font-medium text-foreground">Hattatik AI</p>
			<p class="truncate text-xs text-muted-foreground">Kelola dokumen dan tanya AI</p>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<ThemeToggle variant="icon" />
		<a
			href="/dashboard/profile"
			class="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
		>
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground"
			>
				{initials}
			</div>
			<div class="hidden md:block text-left">
				<p class="text-sm font-medium text-foreground leading-tight">{displayName}</p>
				{#if displayEmail}
					<p class="text-xs text-muted-foreground leading-tight">{displayEmail}</p>
				{/if}
			</div>
		</a>
	</div>
</header>

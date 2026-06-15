<script lang="ts">
	import { cn } from '$lib/utils';
	import type { DtoUserInfo } from '$lib/api/api';

	let {
		user,
		onMenuToggle,
		class: className
	}: {
		user?: DtoUserInfo;
		onMenuToggle?: () => void;
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
		'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-xl px-6',
		className
	)}
>
	<div class="flex items-center gap-4 flex-1">
		<button
			type="button"
			onclick={onMenuToggle}
			class="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
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

		<div class="hidden sm:block">
			<p class="text-sm font-medium text-foreground">Hattatik AI</p>
			<p class="text-xs text-muted-foreground">Kelola dokumen dan tanya AI</p>
		</div>
	</div>

	<a
		href="/dashboard/profile"
		class="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
	>
		<div
			class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xs font-semibold"
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
</header>

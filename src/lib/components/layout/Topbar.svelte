<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		user,
		onMenuToggle,
		class: className
	}: {
		user: { name: string; email: string; avatar?: string };
		onMenuToggle?: () => void;
		class?: string;
	} = $props();

	const initials = $derived(
		user.name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);
</script>

<header
	class={cn(
		'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-xl px-6',
		className
	)}
>
	<!-- Left: Menu Toggle (Mobile) + Search -->
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

		<!-- Search Bar -->
		<div class="relative hidden sm:block max-w-md flex-1">
			<svg
				class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				type="text"
				placeholder="Cari dokumen..."
				class="w-full pl-10 pr-12 py-2 rounded-lg border border-border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
			/>
			<kbd
				class="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded"
			>
				<span class="text-xs">&#8984;</span>F
			</kbd>
		</div>
	</div>

	<!-- Right: Notifications + Profile -->
	<div class="flex items-center gap-2">
		<!-- Notification Bell -->
		<button
			type="button"
			class="relative p-2 rounded-lg hover:bg-muted transition-colors"
			aria-label="Notifications"
		>
			<svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				/>
			</svg>
			<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
		</button>

		<!-- Messages -->
		<button
			type="button"
			class="p-2 rounded-lg hover:bg-muted transition-colors"
			aria-label="Messages"
		>
			<svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
		</button>

		<!-- Divider -->
		<div class="w-px h-6 bg-border mx-2"></div>

		<!-- User Profile -->
		<button
			type="button"
			class="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
		>
			{#if user.avatar}
				<img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full object-cover" />
			{:else}
				<div
					class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xs font-semibold"
				>
					{initials}
				</div>
			{/if}
			<div class="hidden md:block text-left">
				<p class="text-sm font-medium text-foreground leading-tight">{user.name}</p>
				<p class="text-xs text-muted-foreground leading-tight">{user.email}</p>
			</div>
			<svg
				class="w-4 h-4 text-muted-foreground hidden md:block"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</div>
</header>

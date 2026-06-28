<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import LandingLogo from './LandingLogo.svelte';
	import { ThemeToggle } from '$lib/components/layout';

	let { data }: { data: any } = $props();
	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 24;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navLinks = [
		{ name: 'Fitur', href: '#features' },
		{ name: 'Cara Kerja', href: '#how-it-works' }
	];
</script>

<header class="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
	<nav
		class="mx-auto flex max-w-6xl flex-col transition-all duration-300 {scrolled
			? 'rounded-2xl border border-border/60 bg-background/85 shadow-lg shadow-black/5 backdrop-blur-xl'
			: 'rounded-2xl border border-transparent bg-transparent'}"
	>
		<div class="flex h-14 items-center justify-between px-4 sm:px-5">
			<a href="/" class="flex items-center gap-2.5">
				<LandingLogo />
				<span class="text-base font-bold tracking-tight text-foreground">Hattatik AI</span>
			</a>

			<div class="hidden items-center gap-1 md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
					>
						{link.name}
					</a>
				{/each}
			</div>

			<div class="hidden items-center gap-2 md:flex">
				<ThemeToggle variant="icon" />
				{#if data}
					<span class="max-w-[120px] truncate text-sm text-muted-foreground">{data.name}</span>
					<Button href="/dashboard" size="sm" class="rounded-xl font-semibold">Dashboard</Button>
				{:else}
					<Button variant="ghost" href="/auth/login" size="sm" class="rounded-xl text-muted-foreground">
						Masuk
					</Button>
					<Button href="/auth/login" size="sm" class="rounded-xl font-semibold shadow-sm">
						Mulai Gratis
					</Button>
				{/if}
			</div>

			<button
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/60 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		</div>

		{#if mobileMenuOpen}
			<div class="space-y-1 border-t border-border/50 px-4 py-4 md:hidden">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.name}
					</a>
				{/each}
				<div class="mt-3 space-y-2 border-t border-border/50 pt-3">
					<div class="px-1">
						<ThemeToggle />
					</div>
					{#if data}
						<Button href="/dashboard" size="sm" class="w-full rounded-xl">Dashboard</Button>
					{:else}
						<Button variant="ghost" href="/auth/login" size="sm" class="w-full rounded-xl">Masuk</Button>
						<Button href="/auth/login" size="sm" class="w-full rounded-xl">Mulai Gratis</Button>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>

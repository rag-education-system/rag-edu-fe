<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import LandingLogo from './LandingLogo.svelte';

	let { data }: { data: any } = $props();
	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 16;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navLinks = [
		{ name: 'Fitur', href: '#features' },
		{ name: 'Cara Kerja', href: '#how-it-works' }
	];
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
		? 'bg-background/90 backdrop-blur-md border-b border-border/50'
		: 'bg-transparent'}"
>
	<div class="container mx-auto max-w-6xl px-4">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="flex items-center gap-2.5 group">
				<LandingLogo />
				<span class="text-base font-semibold tracking-tight text-foreground">Hattatik AI</span>
			</a>

			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						{link.name}
					</a>
				{/each}
			</div>

			<div class="hidden md:flex items-center gap-3">
				{#if data}
					<span class="text-sm text-muted-foreground">Halo, {data.name}</span>
					<Button href="/dashboard" size="sm" class="rounded-full">Dashboard</Button>
				{:else}
					<Button variant="ghost" href="/auth/login" size="sm" class="text-muted-foreground">
						Masuk
					</Button>
					<Button href="/auth/login" size="sm" class="rounded-full">Mulai</Button>
				{/if}
			</div>

			<button
				class="md:hidden p-2 text-foreground"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		</div>

		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t border-border/50 space-y-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block text-sm text-muted-foreground hover:text-foreground px-2 py-1"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.name}
					</a>
				{/each}
				<div class="pt-2 border-t border-border/50 flex flex-col gap-2">
					{#if data}
						<Button href="/dashboard" size="sm" class="rounded-full">Dashboard</Button>
					{:else}
						<Button variant="ghost" href="/auth/login" size="sm">Masuk</Button>
						<Button href="/auth/login" size="sm" class="rounded-full">Mulai</Button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>

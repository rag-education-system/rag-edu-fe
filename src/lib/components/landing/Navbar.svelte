<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let { data }: { data: any } = $props();
	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
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
		? 'glass-strong shadow-lg shadow-primary/5'
		: 'bg-transparent'}"
>
	<div class="container mx-auto max-w-7xl px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Brand -->
			<a href="/" class="flex items-center gap-2.5 group">
				<!-- Orbit logo icon -->
				<div class="relative w-9 h-9">
					<!-- Outer ring -->
					<div
						class="absolute inset-0 rounded-full border-2 border-primary/30 group-hover:border-primary/50 transition-colors"
					></div>
					<!-- Inner planet -->
					<div
						class="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg"
					></div>
					<!-- Orbiting dot -->
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-spin-slow"
						style="transform-origin: center 18px;"
					></div>
				</div>
				<span class="text-xl font-bold text-gradient">Hattatik AI</span>
			</a>

			<!-- Navigation Links - Desktop -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
					>
						{link.name}
					</a>
				{/each}
			</div>

			<!-- CTA Buttons -->
			<div class="hidden md:flex items-center gap-3">
				{#if data}
					<span class="text-sm text-muted-foreground">Halo, {data.name}</span>
					<Button href="/dashboard" size="sm" class="bg-gradient-primary hover:opacity-90">
						Dashboard
					</Button>
				{:else}
					<Button
						variant="ghost"
						href="/auth/login"
						size="sm"
						class="text-foreground hover:text-primary hover:bg-primary/10"
					>
						Masuk
					</Button>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden p-2 text-foreground hover:text-primary transition-colors"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t border-border/50">
				<div class="flex flex-col gap-4">
					{#each navLinks as link}
						<a
							href={link.href}
							class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
							onclick={() => (mobileMenuOpen = false)}
						>
							{link.name}
						</a>
					{/each}
					<div class="flex flex-col gap-2 pt-2 border-t border-border/50">
						{#if data}
							<Button href="/dashboard" size="sm" class="bg-gradient-primary hover:opacity-90">
								Dashboard
							</Button>
						{:else}
							<Button
								variant="ghost"
								href="/auth/login"
								size="sm"
								class="justify-start text-foreground hover:text-primary hover:bg-primary/10"
							>
								Masuk
							</Button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

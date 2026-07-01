<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import LandingLogo from './LandingLogo.svelte';
	import { ThemeToggle } from '$lib/components/layout';
	import { scrollToSection } from '$lib/utils/scroll';

	let { data }: { data: any } = $props();
	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 24;
			mobileMenuOpen = false;
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') mobileMenuOpen = false;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const navLinks = [
		{ name: 'Fitur', id: 'features' },
		{ name: 'Cara Kerja', id: 'how-it-works' }
	];

	function closeMenu() {
		mobileMenuOpen = false;
	}

	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleNavClick(event: MouseEvent, id: string) {
		event.preventDefault();
		event.stopPropagation();
		closeMenu();
		requestAnimationFrame(() => scrollToSection(id));
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
	<!-- Backdrop — tap di luar menu untuk tutup -->
	{#if mobileMenuOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-black/20 md:hidden"
			aria-label="Tutup menu"
			onclick={closeMenu}
		></button>
	{/if}

	<nav
		class="relative z-50 mx-auto flex max-w-6xl flex-col rounded-2xl border transition-all duration-300
			border-border/70 bg-background shadow-md shadow-black/5
			md:shadow-none
			{scrolled
			? 'md:border-border/60 md:bg-background/85 md:shadow-lg md:shadow-black/5 md:backdrop-blur-xl'
			: 'md:border-transparent md:bg-transparent'}"
	>
		<div class="flex h-14 items-center justify-between px-4 sm:px-5">
			<a href="/" class="flex items-center gap-2.5" onclick={closeMenu}>
				<LandingLogo />
				<span class="text-base font-bold tracking-tight text-foreground">Hattatik AI</span>
			</a>

			<div class="hidden items-center gap-1 md:flex">
				{#each navLinks as link}
					<a
						href="#{link.id}"
						class="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
						onclick={(event) => handleNavClick(event, link.id)}
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
				type="button"
				class="inline-flex h-11 w-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted/60 active:bg-muted md:hidden"
				onclick={toggleMenu}
				aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		</div>

		{#if mobileMenuOpen}
			<div class="space-y-1 border-t border-border/50 px-4 py-4 md:hidden">
				{#each navLinks as link}
					<a
						href="#{link.id}"
						class="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:bg-muted"
						onclick={(event) => handleNavClick(event, link.id)}
					>
						{link.name}
					</a>
				{/each}
				<div class="mt-3 space-y-2 border-t border-border/50 pt-3">
					<div class="px-1">
						<ThemeToggle />
					</div>
					{#if data}
						<Button href="/dashboard" size="sm" class="h-11 w-full rounded-xl" onclick={closeMenu}>
							Dashboard
						</Button>
					{:else}
						<Button variant="ghost" href="/auth/login" size="sm" class="h-11 w-full rounded-xl" onclick={closeMenu}>
							Masuk
						</Button>
						<Button href="/auth/login" size="sm" class="h-11 w-full rounded-xl" onclick={closeMenu}>
							Mulai Gratis
						</Button>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>

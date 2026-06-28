<script lang="ts">
	import LandingLogo from './LandingLogo.svelte';

	const currentYear = new Date().getFullYear();

	const links = {
		product: [
			{ name: 'Fitur', href: '#features' },
			{ name: 'Cara Kerja', href: '#how-it-works' },
			{ name: 'Masuk', href: '/auth/login' }
		],
		legal: [
			{ name: 'Kebijakan Privasi', href: '/privacy' },
			{ name: 'Syarat & Ketentuan', href: '/terms' }
		]
	};
</script>

<footer class="w-full border-t border-border/50 bg-muted/20 px-4 py-14">
	<div class="container mx-auto max-w-6xl">
		<div class="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
			<div class="space-y-4 md:col-span-5">
				<a href="/" class="inline-flex items-center gap-2.5">
					<LandingLogo size="sm" />
					<span class="text-base font-bold tracking-tight">Hattatik AI</span>
				</a>
				<p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
					Platform belajar berbasis dokumen kampus. Pahami materi kuliah dengan jawaban yang bisa
					diverifikasi sumbernya.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8 md:col-span-4 md:col-start-8">
				<div class="space-y-3">
					<h4 class="text-sm font-semibold text-foreground">Produk</h4>
					<ul class="space-y-2.5">
						{#each links.product as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="space-y-3">
					<h4 class="text-sm font-semibold text-foreground">Legal</h4>
					<ul class="space-y-2.5">
						{#each links.legal as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-sm text-muted-foreground sm:flex-row">
			<p>&copy; {currentYear} Hattatik AI. All rights reserved.</p>
			<p>Dibuat dengan ❤️ di Indonesia</p>
		</div>
	</div>
</footer>

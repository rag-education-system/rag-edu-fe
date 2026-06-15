<script lang="ts">
	import LandingLogo from './LandingLogo.svelte';

	const currentYear = new Date().getFullYear();

	const links = {
		product: [
			{ name: 'Fitur', href: '#features' },
			{ name: 'Cara Kerja', href: '#how-it-works' }
		],
		legal: [
			{ name: 'Kebijakan Privasi', href: '/privacy' },
			{ name: 'Syarat & Ketentuan', href: '/terms' }
		]
	};
</script>

<footer class="w-full border-t border-border/40 py-14 px-4">
	<div class="container mx-auto max-w-6xl">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
			<div class="md:col-span-2 space-y-4">
				<a href="/" class="flex items-center gap-2.5 group">
					<LandingLogo size="sm" />
					<span class="text-base font-semibold">Hattatik AI</span>
				</a>
				<p class="text-sm text-muted-foreground leading-relaxed max-w-sm">
					Platform belajar berbasis dokumen kampus. Pahami materi kuliah dengan jawaban yang bisa
					diverifikasi sumbernya.
				</p>
			</div>

			<div class="space-y-3">
				<h4 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Produk</h4>
				<ul class="space-y-2.5">
					{#each links.product as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="space-y-3">
				<h4 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</h4>
				<ul class="space-y-2.5">
					{#each links.legal as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="landing-divider mb-6"></div>

		<div class="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
			<p>&copy; {currentYear} Hattatik AI</p>
			<p>Dibuat di Indonesia</p>
		</div>
	</div>
</footer>

<script lang="ts">
	import LandingLogo from './LandingLogo.svelte';
	import { scrollToSection } from '$lib/utils/scroll';

	const currentYear = new Date().getFullYear();
	const developerLinkedIn = 'https://id.linkedin.com/in/nabhan-arroofi-arpansi-30a536271';

	const links = {
		product: [
			{ name: 'Fitur', id: 'features' },
			{ name: 'Cara Kerja', id: 'how-it-works' },
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
					Platform belajar berbasis dokumen PDF kampus. Pahami materi kuliah dengan jawaban yang bisa
					diverifikasi sumber halamannya.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8 md:col-span-4 md:col-start-8">
				<div class="space-y-3">
					<h4 class="text-sm font-semibold text-foreground">Produk</h4>
					<ul class="space-y-2.5">
						{#each links.product as link}
							<li>
								{#if 'id' in link && link.id}
									<a
										href="#{link.id}"
										class="text-sm text-muted-foreground transition-colors hover:text-primary"
										onclick={(event) => {
											event.preventDefault();
											scrollToSection(link.id);
										}}
									>
										{link.name}
									</a>
								{:else}
									<a
										href={link.href}
										class="text-sm text-muted-foreground transition-colors hover:text-primary"
									>
										{link.name}
									</a>
								{/if}
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

		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row"
		>
			<p class="text-sm text-muted-foreground">&copy; {currentYear} Hattatik AI</p>
			<div class="flex flex-col items-center gap-2 sm:items-end">
				<p class="text-sm text-muted-foreground">Support by 
				<a href="https://pakarhukum.com" target="_blank" rel="noopener noreferrer">
					<span class="text-primary font-semibold">Pakarhukum AI</span>
				</a>
				</p>
				<a
					href={developerLinkedIn}
					target="_blank"
					rel="noopener noreferrer"
					class="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:shadow-md"
				>
					Kontak developer
					<svg
						class="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>

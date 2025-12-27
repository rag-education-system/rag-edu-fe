<script lang="ts">
	// Partner/University logos - placeholder text for now
	const partners = [
		{ name: 'Universitas Indonesia', short: 'UI' },
		{ name: 'Institut Teknologi Bandung', short: 'ITB' },
		{ name: 'Universitas Gadjah Mada', short: 'UGM' },
		{ name: 'Institut Pertanian Bogor', short: 'IPB' },
		{ name: 'Universitas Airlangga', short: 'UNAIR' },
		{ name: 'Universitas Diponegoro', short: 'UNDIP' },
		{ name: 'Universitas Brawijaya', short: 'UB' },
		{ name: 'Institut Teknologi Sepuluh Nopember', short: 'ITS' }
	];
</script>

<section class="w-full py-12 md:py-16 px-4 border-y border-border/30">
	<div class="container mx-auto max-w-7xl">
		<p class="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
			Dipercaya oleh mahasiswa dari berbagai universitas
		</p>

		<!-- Marquee container -->
		<div class="relative overflow-hidden">
			<!-- Gradient masks for smooth fade -->
			<div
				class="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10"
			></div>
			<div
				class="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10"
			></div>

			<!-- Scrolling content -->
			<div class="flex gap-8 animate-marquee">
				{#each [...partners, ...partners] as partner}
					<div
						class="flex-shrink-0 flex items-center justify-center min-w-[140px] h-14 glass rounded-lg px-6 hover:border-primary/30 transition-colors"
					>
						<span class="text-lg font-bold text-muted-foreground/70 hover:text-primary transition-colors"
							>{partner.short}</span
						>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

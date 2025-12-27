<script lang="ts">
	import PricingCard from './PricingCard.svelte';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';

	const plans = [
		{
			name: 'Gratis',
			price: 'Rp 0',
			period: '/selamanya',
			description: 'Untuk mencoba fitur dasar',
			features: [
				'5 dokumen per bulan',
				'50 pertanyaan per bulan',
				'Respon standar',
				'Dukungan komunitas'
			],
			cta: 'Mulai Gratis',
			popular: false
		},
		{
			name: 'Pro',
			price: 'Rp 99K',
			period: '/bulan',
			description: 'Untuk mahasiswa serius',
			features: [
				'Unlimited dokumen',
				'Unlimited pertanyaan',
				'Respon prioritas',
				'Histori chat tersimpan',
				'Export ke PDF',
				'Dukungan email 24/7'
			],
			cta: 'Langganan Pro',
			popular: true
		},
		{
			name: 'Tim',
			price: 'Rp 249K',
			period: '/bulan',
			description: 'Untuk kelompok belajar',
			features: [
				'Semua fitur Pro',
				'Hingga 5 anggota tim',
				'Berbagi dokumen tim',
				'Admin dashboard',
				'Analitik penggunaan',
				'Dukungan prioritas'
			],
			cta: 'Hubungi Kami',
			popular: false
		}
	];
</script>

<section id="pricing" class="relative w-full py-24 md:py-32 px-4 overflow-hidden">
	<!-- Background effects -->
	<div
		class="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
	></div>
	<div
		class="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none"
	></div>

	<div class="container relative mx-auto max-w-7xl">
		<!-- Section header -->
		<div class="text-center space-y-4 mb-16">
			<ScrollReveal direction="down" delay={0}>
				<div
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-sm text-primary"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							fill-rule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 7.5A.75.75 0 009 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 009 12h3.622a2.251 2.251 0 01-2.122 1.5H9a.75.75 0 00-.53 1.28l3 3a.75.75 0 101.06-1.06L10.8 14.988A3.752 3.752 0 0014.175 12H15a.75.75 0 000-1.5h-.825A3.733 3.733 0 0013.5 9H15a.75.75 0 000-1.5H9z"
							clip-rule="evenodd"
						/>
					</svg>
					Harga
				</div>
			</ScrollReveal>
			<ScrollReveal direction="up" delay={100}>
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold">
					Pilih Paket <span class="text-gradient">Terbaik</span>
				</h2>
			</ScrollReveal>
			<ScrollReveal direction="up" delay={200}>
				<p class="text-muted-foreground text-lg max-w-2xl mx-auto">
					Mulai gratis, upgrade kapan saja sesuai kebutuhan Anda
				</p>
			</ScrollReveal>
		</div>

		<!-- Pricing cards grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
			{#each plans as plan, i}
				<ScrollReveal direction="scale" delay={plan.popular ? 0 : 100 + Math.abs(i - 1) * 100}>
					<PricingCard
						name={plan.name}
						price={plan.price}
						period={plan.period}
						description={plan.description}
						features={plan.features}
						cta={plan.cta}
						popular={plan.popular}
					/>
				</ScrollReveal>
			{/each}
		</div>

		<!-- Money back guarantee -->
		<ScrollReveal direction="up" delay={300}>
			<div class="mt-12 text-center">
				<p class="text-sm text-muted-foreground flex items-center justify-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-5 h-5 text-primary"
					>
						<path
							fill-rule="evenodd"
							d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
							clip-rule="evenodd"
						/>
					</svg>
					Garansi uang kembali 30 hari untuk semua paket berbayar
				</p>
			</div>
		</ScrollReveal>
	</div>
</section>

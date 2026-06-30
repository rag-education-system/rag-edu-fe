<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
	import { scrollToSection } from '$lib/utils/scroll';
	import Hero3DLogo from './Hero3DLogo.svelte';
</script>

<section class="landing-hero relative overflow-hidden px-4 pb-16 pt-32 md:pb-24 md:pt-40">
	<div class="landing-hero-glow pointer-events-none absolute inset-0"></div>
	<div class="landing-grid pointer-events-none absolute inset-0 opacity-40"></div>

	<div class="container relative mx-auto max-w-6xl">
		<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<div class="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
				<ScrollReveal direction="down" delay={0}>
					<div
						class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
					>
						<span class="relative flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
						</span>
						Platform AI untuk Belajar Kampus
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={80}>
					<h1
						class="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
					>
						Belajar dari materi kuliah
						<span class="landing-gradient-text"> yang Anda percaya</span>
					</h1>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={160}>
					<p class="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
						Upload PDF, ajukan pertanyaan, dapatkan jawaban dengan rujukan halaman yang jelas — bukan
						tebakan dari internet.
					</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={240}>
					<div class="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
						<Button href="/auth/login" size="lg" class="h-12 w-full rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20 sm:w-auto">
							Mulai Belajar
							<svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="h-12 w-full rounded-xl border-border/70 px-8 text-base font-medium sm:w-auto"
							onclick={() => scrollToSection('how-it-works')}
						>
							Lihat Demo
						</Button>
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={320}>
					<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
						{#each ['Gratis untuk kampus', 'Sumber terverifikasi', 'Privasi terjaga'] as item}
							<div class="flex items-center gap-2 text-sm text-muted-foreground">
								<svg class="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
								{item}
							</div>
						{/each}
					</div>
				</ScrollReveal>
			</div>

			<ScrollReveal direction="right" delay={200} class="relative">
				<div class="relative mx-auto max-w-lg lg:max-w-none">
					<Hero3DLogo />
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

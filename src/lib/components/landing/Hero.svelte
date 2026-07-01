<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
	import { scrollToSection } from '$lib/utils/scroll';
	import Hero3DLogo from './Hero3DLogo.svelte';
</script>

<!-- Mobile Layout -->
<section class="relative overflow-hidden px-5 pb-10 pt-24 lg:hidden">
	<!-- 3D Logo - Centered, contained -->
	<div class="mx-auto mb-8 h-[220px] w-[220px]">
		<Hero3DLogo />
	</div>

	<!-- Content -->
	<div class="text-center">
		<ScrollReveal direction="up" delay={0}>
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-foreground">
				Belajar dari materi kuliah
				<span class="landing-gradient-text"> yang Anda percaya</span>
			</h1>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={80}>
			<p class="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
				Upload PDF, ajukan pertanyaan, dapatkan jawaban dengan rujukan halaman yang jelas.
			</p>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={160}>
			<div class="mt-6 flex flex-col gap-2.5">
				<Button 
					href="/auth/login" 
					size="lg" 
					class="h-12 w-full rounded-xl text-base font-semibold"
				>
					Mulai Belajar
					<svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
					</svg>
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="h-12 w-full rounded-xl text-base font-medium"
					onclick={() => scrollToSection('how-it-works')}
				>
					Lihat Cara Kerja
				</Button>
			</div>
		</ScrollReveal>

		<ScrollReveal direction="up" delay={240}>
			<div class="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				{#each ['Gratis', 'Sumber terverifikasi', 'Privasi terjaga'] as item}
					<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
						<svg class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						{item}
					</div>
				{/each}
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- Desktop Layout -->
<section class="landing-hero relative hidden overflow-hidden px-4 pb-24 pt-40 lg:block">
	<div class="landing-hero-glow pointer-events-none absolute inset-0"></div>
	<div class="landing-grid pointer-events-none absolute inset-0 opacity-40"></div>

	<div class="container relative mx-auto max-w-6xl">
		<div class="grid items-center gap-16 lg:grid-cols-2">
			<div class="max-w-xl text-left">
				<ScrollReveal direction="up" delay={0}>
					<h1 class="text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-foreground">
						Belajar dari materi kuliah
						<span class="landing-gradient-text"> yang Anda percaya</span>
					</h1>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={80}>
					<p class="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
						Upload PDF, ajukan pertanyaan, dapatkan jawaban dengan rujukan halaman yang jelas — bukan
						tebakan dari internet.
					</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={160}>
					<div class="mt-8 flex items-center gap-3">
						<Button href="/auth/login" size="lg" class="h-12 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20">
							Mulai Belajar
							<svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="h-12 rounded-xl border-border/70 px-8 text-base font-medium"
							onclick={() => scrollToSection('how-it-works')}
						>
							Lihat Demo
						</Button>
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={240}>
					<div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
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
				<div class="relative mx-auto h-[450px] max-w-lg lg:max-w-none">
					<Hero3DLogo />
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
	import HeroPreview from './HeroPreview.svelte';
</script>

<section class="relative w-full pt-28 pb-20 md:pt-36 md:pb-28 px-4 overflow-hidden">
	<div class="absolute inset-0 landing-dot-grid opacity-40 pointer-events-none"></div>
	<div
		class="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none"
	></div>

	<div class="container relative mx-auto max-w-6xl">
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
			<div class="flex flex-col space-y-8">
				<ScrollReveal direction="down" delay={0}>
					<p class="landing-label">Platform belajar kampus</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={80}>
					<h1 class="landing-serif text-[2.75rem] sm:text-5xl lg:text-[3.5rem] leading-[1.1] text-foreground">
						Pahami materi kuliah dari
						<em class="text-primary not-italic">dokumen Anda sendiri</em>
					</h1>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={160}>
					<p class="text-lg text-muted-foreground max-w-md leading-relaxed">
						Hattatik AI membantu mahasiswa dan dosen menemukan jawaban dari materi yang sudah diunggah —
						dengan rujukan halaman yang jelas, bukan tebakan dari internet.
					</p>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={240}>
					<div class="flex flex-col sm:flex-row gap-3">
						<Button href="/auth/login" size="lg" class="rounded-full px-8 font-medium">
							Mulai Belajar
							<svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="rounded-full px-8 border-border/60 hover:bg-muted/30"
							onclick={() =>
								document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
						>
							Lihat Cara Kerja
						</Button>
					</div>
				</ScrollReveal>

				<ScrollReveal direction="up" delay={320}>
					<div class="flex flex-wrap gap-6 pt-2">
						<div>
							<p class="text-2xl font-semibold text-foreground">PDF</p>
							<p class="text-sm text-muted-foreground">Format didukung</p>
						</div>
						<div class="w-px bg-border/50 hidden sm:block"></div>
						<div>
							<p class="text-2xl font-semibold text-foreground">Rujukan</p>
							<p class="text-sm text-muted-foreground">Setiap jawaban bersumber</p>
						</div>
						<div class="w-px bg-border/50 hidden sm:block"></div>
						<div>
							<p class="text-2xl font-semibold text-foreground">Kampus</p>
							<p class="text-sm text-muted-foreground">Akun via admin</p>
						</div>
					</div>
				</ScrollReveal>
			</div>

			<ScrollReveal direction="right" delay={200} class="relative lg:pl-4">
				<HeroPreview />
			</ScrollReveal>
		</div>
	</div>
</section>

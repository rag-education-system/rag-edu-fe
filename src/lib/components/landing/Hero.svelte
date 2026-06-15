<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
	import OrbitVisual from './OrbitVisual.svelte';
</script>

<section
	class="relative w-full min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden"
>
	<!-- Background effects -->
	<div class="absolute inset-0 bg-linear-to-b from-background via-background to-primary/5"></div>

	<!-- Subtle grid pattern -->
	<div
		class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
	></div>

	<!-- Top glow -->
	<div
		class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl"
	></div>

	<div class="container relative mx-auto max-w-7xl">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
			<!-- Text Content -->
			<div class="flex flex-col space-y-8 text-center lg:text-left order-2 lg:order-1">
				<!-- Badge -->
				<ScrollReveal direction="down" delay={0}>
					<div class="flex justify-center lg:justify-start">
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
									d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
									clip-rule="evenodd"
								/>
							</svg>
							Powered by RAG Technology
						</div>
					</div>
				</ScrollReveal>

				<!-- Headline -->
				<ScrollReveal direction="up" delay={100}>
					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
						Belajar
						<span class="text-gradient">10x Lebih Cepat</span>
						dengan AI
					</h1>
				</ScrollReveal>

				<!-- Description -->
				<ScrollReveal direction="up" delay={200}>
					<p
						class="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
					>
						Hattatik AI menggunakan teknologi Retrieval-Augmented Generation untuk membantu Anda
						memahami materi kuliah dengan cepat dan akurat.
					</p>
				</ScrollReveal>

				<!-- CTA Buttons -->
				<ScrollReveal direction="up" delay={300}>
					<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
						<Button
							href="/auth/login"
							size="lg"
							class="bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 text-base font-medium"
						>
							Mulai Sekarang
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="w-5 h-5 ml-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
								/>
							</svg>
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="border-primary/30 hover:bg-primary/10 text-base font-medium"
							onclick={() =>
								document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="w-5 h-5 mr-2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
								/>
							</svg>
							Lihat Demo
						</Button>
					</div>
				</ScrollReveal>

				<!-- Trust indicators -->
				<ScrollReveal direction="up" delay={400}>
					<div
						class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 justify-center lg:justify-start"
					>
						<div class="flex -space-x-3">
							{#each Array(5) as _, i}
								<div
									class="w-10 h-10 rounded-full bg-linear-to-br from-primary/60 to-accent/60 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
									style="z-index: {5 - i};"
								>
									{['A', 'B', 'C', 'D', 'E'][i]}
								</div>
							{/each}
						</div>
						<div class="text-sm text-muted-foreground">
							<span class="text-foreground font-semibold">1,000+</span> mahasiswa sudah bergabung
						</div>
					</div>
				</ScrollReveal>
			</div>

			<!-- Orbit Visual -->
			<ScrollReveal direction="scale" delay={200} class="flex justify-center lg:justify-end order-1 lg:order-2">
				<OrbitVisual />
			</ScrollReveal>
		</div>
	</div>

	<!-- Bottom gradient fade -->
	<div
		class="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent"
	></div>
</section>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
</script>

<section class="relative w-full px-4 py-20 md:py-28">
	<div class="container mx-auto max-w-6xl">
		<ScrollReveal direction="up" delay={0}>
			<div class="landing-cta relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-16 md:py-20">
				<div class="landing-cta-glow pointer-events-none absolute inset-0"></div>

				<div class="relative mx-auto max-w-2xl space-y-6">
					<h2 class="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
						Siap belajar lebih efektif?
					</h2>
					<p class="text-lg leading-relaxed text-white/80">
						Akun mahasiswa dan dosen dibuat oleh administrator kampus. Hubungi admin untuk
						mendapatkan akses ke platform.
					</p>

					<div class="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
						<Button
							href="/auth/login"
							size="lg"
							class="h-12 w-full rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-xl hover:bg-white/90 sm:w-auto"
						>
							Masuk ke Platform
						</Button>
						<Button
							variant="outline"
							size="lg"
							class="h-12 w-full rounded-xl border-white/30 bg-white/10 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
							href="mailto:hello@hattatik.ai"
						>
							Hubungi Admin
						</Button>
					</div>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>

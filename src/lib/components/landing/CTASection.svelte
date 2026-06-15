<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
</script>

<section class="relative w-full py-24 md:py-32 px-4">
	<div class="container mx-auto max-w-3xl">
		<ScrollReveal direction="up" delay={0}>
			<div class="text-center space-y-6">
				<p class="landing-label">Mulai sekarang</p>
				<h2 class="landing-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
					Siap belajar lebih efektif?
				</h2>
				<p class="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
					Akun mahasiswa dan dosen dibuat oleh administrator kampus. Hubungi admin untuk mendapatkan
					akses.
				</p>

				<div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
					<Button href="/auth/login" size="lg" class="rounded-full px-8 font-medium">
						Masuk ke Platform
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="rounded-full px-8 border-border/60 hover:bg-muted/30"
						href="mailto:hello@hattatik.ai"
					>
						Hubungi Admin
					</Button>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';
</script>

<section class="relative w-full py-24 md:py-32 px-4 overflow-hidden">
	<!-- Background gradient -->
	<div
		class="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none"
	></div>

	<div class="container relative mx-auto max-w-4xl">
		<ScrollReveal direction="scale" delay={0} duration={700}>
			<div class="glass-strong rounded-3xl p-8 md:p-12 lg:p-16 text-center space-y-8">
			<!-- Decorative elements -->
			<div
				class="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none"
			></div>
			<div
				class="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none"
			></div>

			<!-- Content -->
			<div class="relative space-y-6">
				<!-- Icon -->
				<div
					class="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg glow-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-8 h-8 text-background"
					>
						<path
							d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z"
						/>
						<path
							d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z"
						/>
						<path
							d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z"
						/>
					</svg>
				</div>

				<!-- Headline -->
				<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold">
					Siap Meningkatkan
					<br />
					<span class="text-gradient">Pembelajaran Anda?</span>
				</h2>

				<!-- Description -->
				<p class="text-muted-foreground text-lg max-w-xl mx-auto">
					Bergabung dengan ribuan mahasiswa yang sudah merasakan manfaat belajar dengan AI. Gratis
					untuk memulai, tanpa kartu kredit.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Button
						href="/auth/register"
						size="lg"
						class="bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 text-base font-medium"
					>
						Daftar Gratis Sekarang
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
						href="mailto:hello@orbitalis.ai"
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
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							/>
						</svg>
						Hubungi Kami
					</Button>
				</div>
			</div>
			</div>
		</ScrollReveal>
	</div>
</section>

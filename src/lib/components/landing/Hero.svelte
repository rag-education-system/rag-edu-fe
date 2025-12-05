<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	function scrollToFeatures() {
		const featuresSection = document.getElementById('features');
		if (featuresSection) {
			featuresSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section class="w-full py-20 md:py-32 px-4">
	<div class="container mx-auto max-w-6xl">
		<div class="flex flex-col items-center text-center space-y-6">
			<h1 class="text-5xl md:text-6xl font-bold tracking-tight">
				Smart Learning with <span class="text-primary">AI-Powered</span> RAG Technology
			</h1>
			<p class="text-xl text-muted-foreground max-w-3xl leading-relaxed">
				Transform your educational experience with retrieval-augmented generation. Access accurate
				information instantly from your course materials and enhance your learning journey.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 pt-4">
				<Button href="/auth/register" size="lg" class="text-base">Mulai Sekarang</Button>
				<Button variant="outline" size="lg" class="text-base" onclick={scrollToFeatures}>
					Pelajari Lebih Lanjut
				</Button>
			</div>
		</div>
	</div>
</section>

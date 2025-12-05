<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';

	const steps = [
		{
			number: 1,
			title: 'Upload Materi',
			description: 'Upload materi kuliah Anda dalam berbagai format (PDF, DOCX, PPT) ke dalam sistem.'
		},
		{
			number: 2,
			title: 'AI Processing',
			description:
				'Sistem menganalisis dan mengindeks konten secara otomatis menggunakan teknologi RAG.'
		},
		{
			number: 3,
			title: 'Ajukan Pertanyaan',
			description:
				'Ajukan pertanyaan tentang materi Anda menggunakan bahasa alami seperti berbicara dengan asisten.'
		},
		{
			number: 4,
			title: 'Dapatkan Jawaban',
			description:
				'Terima jawaban akurat dengan sumber referensi yang jelas dari materi pembelajaran Anda.'
		}
	];
</script>

<section id="how-it-works" class="w-full py-16 md:py-24 px-4">
	<div class="container mx-auto max-w-4xl">
		<div class="text-center space-y-4 mb-12">
			<h2 class="text-3xl md:text-4xl font-bold">Cara Kerja Sistem</h2>
			<p class="text-muted-foreground text-lg max-w-2xl mx-auto">
				Empat langkah sederhana untuk memulai pembelajaran cerdas dengan AI
			</p>
		</div>

		<div class="space-y-8">
			{#each steps as step, index}
				<div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
					<div
						class="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
					>
						<span class="text-2xl font-bold">{step.number}</span>
					</div>
					<div class="flex-1 space-y-2">
						<h3 class="text-xl font-semibold">{step.title}</h3>
						<p class="text-muted-foreground leading-relaxed">{step.description}</p>
					</div>
				</div>
				{#if index < steps.length - 1}
					<Separator class="my-8" />
				{/if}
			{/each}
		</div>
	</div>
</section>

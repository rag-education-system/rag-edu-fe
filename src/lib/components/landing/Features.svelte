<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';

	const features = [
		{
			title: 'Pencarian Cerdas',
			description: 'Cari informasi dari materi kuliah dengan cepat menggunakan AI yang canggih dan akurat.',
			iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
		},
		{
			title: 'Jawaban Kontekstual',
			description: 'Dapatkan jawaban yang relevan dengan konteks pembelajaran Anda secara real-time.',
			iconPath: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
		},
		{
			title: 'Multi-Document Support',
			description: 'Upload dan kelola berbagai jenis dokumen pembelajaran dalam satu platform terpadu.',
			iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
		},
		{
			title: 'Real-time Processing',
			description: 'Proses dokumen dan query secara real-time dengan teknologi AI terdepan.',
			iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
		},
		{
			title: 'Pembelajaran Personal',
			description: 'Sistem pembelajaran yang disesuaikan dengan kebutuhan dan gaya belajar Anda.',
			iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
		},
		{
			title: 'Aman & Privat',
			description: 'Data Anda aman dengan enkripsi tingkat enterprise dan kontrol privasi penuh.',
			iconPath: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
		}
	];
</script>

<section id="features" class="w-full py-16 md:py-24 px-4 bg-muted/30">
	<div class="container mx-auto max-w-7xl">
		<div class="text-center space-y-4 mb-12">
			<h2 class="text-3xl md:text-4xl font-bold">Fitur Unggulan</h2>
			<p class="text-muted-foreground text-lg max-w-2xl mx-auto">
				Teknologi AI canggih yang dirancang khusus untuk meningkatkan pengalaman belajar Anda
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as feature}
				<FeatureCard title={feature.title} description={feature.description}>
					{#snippet icon()}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-10 h-10"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={feature.iconPath} />
						</svg>
					{/snippet}
				</FeatureCard>
			{/each}
		</div>
	</div>
</section>

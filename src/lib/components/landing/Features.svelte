<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';

	const features = [
		{
			title: 'Jawaban dari materi kampus',
			description:
				'Setiap respons diambil dari dokumen yang Anda atau dosen unggah — bukan dari sumber acak di internet.',
			iconPath:
				'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
			highlighted: true
		},
		{
			title: 'Rujukan halaman jelas',
			description: 'Tahu persis dari file dan halaman mana jawaban berasal, siap diverifikasi.',
			iconPath: 'M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3',
			highlighted: false
		},
		{
			title: 'Upload sekali, tanya kapan saja',
			description: 'PDF atau gambar — unggah sekali, ajukan pertanyaan berulang kali tanpa batas.',
			iconPath:
				'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
			highlighted: false
		},
		{
			title: 'Untuk mahasiswa & dosen',
			description:
				'Dosen mengelola materi, mahasiswa belajar dari sumber yang sama. Satu platform, satu kebenaran materi.',
			iconPath:
				'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
			highlighted: false
		},
		{
			title: 'Mode belajar fleksibel',
			description:
				'Hybrid edukatif atau strict — pilih apakah AI boleh melengkapi dari pengetahuan umum atau hanya dari dokumen.',
			iconPath:
				'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
			highlighted: false
		},
		{
			title: 'Privasi & kontrol kampus',
			description:
				'Akun dikelola administrator. Dokumen private atau public sesuai kebijakan jurusan.',
			iconPath:
				'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
			highlighted: false
		}
	];
</script>

<section id="features" class="relative w-full px-4 py-20 md:py-28">
	<div class="container mx-auto max-w-6xl">
		<div class="mx-auto mb-14 max-w-2xl text-center">
			<ScrollReveal direction="up" delay={0}>
				<p class="landing-badge mb-4">Fitur Unggulan</p>
				<h2 class="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
					Semua yang dibutuhkan untuk belajar efektif
				</h2>
				<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
					Bukan chatbot umum. Hattatik AI dirancang khusus untuk membantu Anda memahami materi kuliah
					yang sudah ada.
				</p>
			</ScrollReveal>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature, i}
				<ScrollReveal direction="up" delay={i * 60}>
					<FeatureCard
						title={feature.title}
						description={feature.description}
						highlighted={feature.highlighted}
					>
						{#snippet icon()}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.75"
								stroke="currentColor"
								class="h-6 w-6"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={feature.iconPath} />
							</svg>
						{/snippet}
					</FeatureCard>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

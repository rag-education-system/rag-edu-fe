<script lang="ts">
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';

	const steps = [
		{
			number: '1',
			title: 'Unggah materi',
			description: 'Upload file PDF materi kuliah ke platform (maks. 10MB per file).',
			icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
		},
		{
			number: '2',
			title: 'Sistem mengindeks',
			description: 'Konten dianalisis dan disimpan agar bisa dicari dengan cepat.',
			icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
		},
		{
			number: '3',
			title: 'Ajukan pertanyaan',
			description: 'Tanyakan dengan bahasa sehari-hari, seperti ke teman seperkuliahan.',
			icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
		},
		{
			number: '4',
			title: 'Jawaban + sumber',
			description: 'Dapatkan jawaban lengkap dengan rujukan file dan halaman.',
			icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
		}
	];
</script>

<section id="how-it-works" class="relative w-full bg-muted/25 px-4 py-20 md:py-28">
	<div class="container mx-auto max-w-6xl">
		<div class="mx-auto mb-14 max-w-2xl text-center">
			<ScrollReveal direction="up" delay={0}>
				<p class="landing-badge mb-4">Cara Kerja</p>
				<h2 class="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
					Empat langkah sederhana
				</h2>
				<p class="mt-4 text-lg text-muted-foreground">
					Dari upload dokumen hingga jawaban terverifikasi — dalam hitungan menit.
				</p>
			</ScrollReveal>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each steps as step, i}
				<ScrollReveal direction="up" delay={80 + i * 60}>
					<div class="relative flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
						{#if i < steps.length - 1}
							<div
								class="absolute -right-2 top-1/2 z-10 hidden h-0.5 w-4 -translate-y-1/2 bg-primary/30 lg:block"
							></div>
						{/if}

						<div class="mb-4 flex items-center gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/20"
							>
								{step.number}
							</div>
							<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
									<path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
								</svg>
							</div>
						</div>

						<h3 class="mb-2 font-bold text-foreground">{step.title}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
					</div>
				</ScrollReveal>
			{/each}
		</div>

		<ScrollReveal direction="up" delay={400}>
			<div class="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
				<div class="grid lg:grid-cols-2">
					<div class="border-b border-border/50 p-6 md:p-8 lg:border-b-0 lg:border-r">
						<p class="mb-2 text-sm font-semibold text-primary">Contoh percakapan nyata</p>
						<h3 class="text-xl font-bold text-foreground">Tanya, dapat jawaban, cek sumbernya</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
							Mahasiswa menanyakan perbedaan stack dan queue. AI menjawab dari materi yang diunggah
							dan menunjukkan halaman sumbernya.
						</p>
					</div>

					<div class="space-y-3 bg-muted/20 p-6 md:p-8">
						<div class="flex justify-end">
							<div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
								Bedanya stack dan queue apa?
							</div>
						</div>
						<div class="rounded-2xl rounded-tl-sm border border-border/50 bg-background px-4 py-3 text-sm">
							<p class="leading-relaxed">
								<strong>Stack</strong> = LIFO, elemen terakhir masuk keluar duluan.
								<strong>Queue</strong> = FIFO, elemen pertama masuk keluar duluan.
							</p>
							<div class="mt-3 flex items-center gap-2 text-xs text-primary">
								<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
								Struktur_Data_Bab2.pdf · hal. 8
							</div>
						</div>
					</div>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>






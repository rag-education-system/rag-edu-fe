<script lang="ts">
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';

	const steps = [
		{
			number: '01',
			title: 'Unggah materi',
			description: 'Dosen atau mahasiswa mengunggah PDF, DOCX, atau PPT ke platform.'
		},
		{
			number: '02',
			title: 'Sistem mengindeks',
			description: 'Konten dianalisis dan disimpan agar bisa dicari dengan cepat.'
		},
		{
			number: '03',
			title: 'Ajukan pertanyaan',
			description: 'Tanyakan dengan bahasa sehari-hari, seperti bertanya ke teman seperkuliahan.'
		},
		{
			number: '04',
			title: 'Dapatkan jawaban + sumber',
			description: 'Jawaban disertai rujukan file dan halaman, sehingga bisa diverifikasi.'
		}
	];
</script>

<section id="how-it-works" class="relative w-full py-24 md:py-32 px-4 border-t border-border/40">
	<div class="container mx-auto max-w-6xl">
		<div class="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
			<div class="space-y-12">
				<ScrollReveal direction="up" delay={0}>
					<div>
						<p class="landing-label mb-4">Cara kerja</p>
						<h2 class="landing-serif text-3xl md:text-4xl text-foreground">
							Empat langkah, langsung ke intinya
						</h2>
					</div>
				</ScrollReveal>

				<div class="space-y-0">
					{#each steps as step, i}
						<ScrollReveal direction="up" delay={100 + i * 80}>
							<div class="group flex gap-6 py-6 {i < steps.length - 1 ? 'border-b border-border/40' : ''}">
								<span class="text-sm font-mono text-primary/70 pt-1 shrink-0">{step.number}</span>
								<div>
									<h3 class="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
										{step.title}
									</h3>
									<p class="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
								</div>
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>

			<ScrollReveal direction="right" delay={200} class="lg:sticky lg:top-28">
				<div class="landing-card p-6 md:p-8 space-y-5">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium">Contoh percakapan</p>
						<span class="text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full">
							Materi: Struktur Data
						</span>
					</div>

					<div class="space-y-4">
						<div class="flex justify-end">
							<div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-3 text-sm">
								Bedanya stack dan queue apa?
							</div>
						</div>

						<div class="rounded-2xl rounded-tl-sm border border-border/50 bg-background/50 px-4 py-4 text-sm space-y-3">
							<p class="leading-relaxed">
								<strong>Stack</strong> mengikuti prinsip LIFO (Last In, First Out) — elemen terakhir masuk
								keluar duluan. <strong>Queue</strong> mengikuti FIFO (First In, First Out) — elemen pertama
								masuk keluar duluan.
							</p>
							<div class="flex items-center gap-2 pt-2 border-t border-border/40">
								<svg class="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
								<span class="text-xs text-muted-foreground">Struktur_Data_Bab2.pdf · hal. 8</span>
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-full border border-border/50 bg-muted/20 px-4 py-2.5">
						<span class="flex-1 text-sm text-muted-foreground">Ketik pertanyaan...</span>
						<div class="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
							<svg class="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
								<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
							</svg>
						</div>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

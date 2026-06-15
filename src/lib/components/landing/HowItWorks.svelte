<script lang="ts">
	import ScrollReveal from '$lib/components/ui/scroll-reveal.svelte';

	const steps = [
		{
			number: 1,
			title: 'Upload Materi',
			description: 'Upload materi kuliah dalam berbagai format (PDF, DOCX, PPT)',
			iconPath:
				'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
		},
		{
			number: 2,
			title: 'AI Processing',
			description: 'Sistem menganalisis dan mengindeks konten secara otomatis',
			iconPath:
				'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z'
		},
		{
			number: 3,
			title: 'Ajukan Pertanyaan',
			description: 'Tanyakan apapun dengan bahasa natural seperti berbicara dengan asisten',
			iconPath:
				'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z'
		},
		{
			number: 4,
			title: 'Dapatkan Jawaban',
			description: 'Terima jawaban akurat dengan sumber referensi yang jelas',
			iconPath: 'M4.5 12.75l6 6 9-13.5'
		}
	];
</script>

<section id="how-it-works" class="relative w-full py-24 md:py-32 px-4 overflow-hidden">
	<!-- Background effect -->
	<div
		class="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none"
	></div>

	<div class="container mx-auto max-w-7xl">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<!-- Steps -->
			<div class="space-y-8">
				<!-- Section header -->
				<div class="space-y-4">
					<ScrollReveal direction="left" delay={0}>
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
									d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
									clip-rule="evenodd"
								/>
							</svg>
							Cara Kerja
						</div>
					</ScrollReveal>
					<ScrollReveal direction="left" delay={100}>
						<h2 class="text-3xl md:text-4xl font-bold">
							Empat Langkah <span class="text-gradient">Mudah</span>
						</h2>
					</ScrollReveal>
					<ScrollReveal direction="left" delay={200}>
						<p class="text-muted-foreground text-lg">
							Mulai belajar lebih cerdas dalam hitungan menit
						</p>
					</ScrollReveal>
				</div>

				<!-- Steps list -->
				<div class="space-y-6">
					{#each steps as step, i}
						<ScrollReveal direction="left" delay={300 + i * 150}>
							<div class="flex gap-4 group">
								<div
									class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-background font-bold shadow-lg glow-sm"
								>
									{step.number}
								</div>
								<div class="flex-1 pt-1">
									<h3 class="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
										{step.title}
									</h3>
									<p class="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
								</div>
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>

			<!-- Chat Mockup -->
			<ScrollReveal direction="right" delay={200} class="relative">
				<div class="relative mx-auto w-full max-w-md">
					<!-- Decorative glow -->
					<div
						class="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
					></div>
					<div
						class="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/15 rounded-full blur-2xl"
					></div>

					<!-- Phone/App mockup -->
					<div class="relative glass-strong rounded-3xl p-4 shadow-2xl shadow-primary/10">
						<!-- App header -->
						<div class="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
							<div class="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-4 h-4 text-background"
								>
									<path
										d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-sm font-semibold">Hattatik AI</p>
								<p class="text-xs text-muted-foreground">Online</p>
							</div>
						</div>

						<!-- Chat messages -->
						<div class="space-y-4">
							<!-- AI message -->
							<div class="flex gap-3">
								<div
									class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
								>
									<span class="text-xs font-bold text-primary">AI</span>
								</div>
								<div class="flex-1 glass rounded-2xl rounded-tl-sm p-3 text-sm">
									Halo! Saya Hattatik AI. Upload materi Anda dan tanyakan apapun yang ingin Anda
									pelajari!
								</div>
							</div>

							<!-- User message -->
							<div class="flex gap-3 justify-end">
								<div class="glass rounded-2xl rounded-tr-sm p-3 text-sm bg-primary/10 max-w-[80%]">
									Jelaskan konsep RAG dalam machine learning
								</div>
							</div>

							<!-- AI response -->
							<div class="flex gap-3">
								<div
									class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
								>
									<span class="text-xs font-bold text-primary">AI</span>
								</div>
								<div class="flex-1 glass rounded-2xl rounded-tl-sm p-3 text-sm space-y-2">
									<p>
										<strong>RAG (Retrieval-Augmented Generation)</strong> adalah teknik yang menggabungkan:
									</p>
									<ul class="list-disc list-inside text-muted-foreground space-y-1">
										<li>Retrieval: Mengambil informasi relevan</li>
										<li>Generation: Menghasilkan jawaban kontekstual</li>
									</ul>
									<p class="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
										📚 Sumber: Materi_ML_Chapter5.pdf
									</p>
								</div>
							</div>
						</div>

						<!-- Input field mockup -->
						<div class="mt-4 pt-3 border-t border-border/50">
							<div class="flex gap-2">
								<div
									class="flex-1 glass rounded-full px-4 py-2 text-sm text-muted-foreground"
								>
									Ketik pertanyaan...
								</div>
								<button
									type="button"
									class="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-background shadow-lg"
									aria-label="Kirim pesan"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="w-5 h-5"
									>
										<path
											d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

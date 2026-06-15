<script lang="ts">
	const documents = [
		{ name: 'Algoritma Bab 3.pdf', pages: 24, active: true },
		{ name: 'Catatan Kuliah W3.docx', pages: 8, active: false },
		{ name: 'Slide Presentasi.pptx', pages: 32, active: false }
	];
</script>

<div class="relative w-full max-w-lg mx-auto">
	<!-- Window chrome -->
	<div class="rounded-2xl border border-border/60 bg-card/80 shadow-2xl shadow-black/20 overflow-hidden">
		<!-- Title bar -->
		<div class="flex items-center gap-3 border-b border-border/50 px-4 py-3 bg-muted/30">
			<div class="flex gap-1.5">
				<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
			</div>
			<span class="text-xs text-muted-foreground font-medium">Hattatik AI — Ruang Belajar</span>
		</div>

		<div class="grid grid-cols-5 min-h-[320px]">
			<!-- Sidebar dokumen -->
			<div class="col-span-2 border-r border-border/50 bg-muted/20 p-3 space-y-2">
				<p class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1 mb-3">
					Materi
				</p>
				{#each documents as doc}
					<div
						class="rounded-lg px-2.5 py-2 text-xs transition-colors {doc.active
							? 'bg-primary/10 border border-primary/20 text-foreground'
							: 'text-muted-foreground hover:bg-muted/40'}"
					>
						<p class="font-medium truncate leading-snug">{doc.name}</p>
						<p class="text-[10px] mt-0.5 opacity-70">{doc.pages} halaman</p>
					</div>
				{/each}
			</div>

			<!-- Area percakapan -->
			<div class="col-span-3 flex flex-col p-3">
				<div class="flex-1 space-y-3 overflow-hidden">
					<!-- Pertanyaan user -->
					<div class="flex justify-end">
						<div class="max-w-[90%] rounded-xl rounded-tr-sm bg-secondary px-3 py-2 text-xs leading-relaxed">
							Apa perbedaan BFS dan DFS? Jelaskan dari materi kita.
						</div>
					</div>

					<!-- Jawaban -->
					<div class="space-y-2">
						<div class="rounded-xl rounded-tl-sm border border-border/50 bg-background/60 px-3 py-2.5 text-xs leading-relaxed">
							<p class="mb-2">
								<strong>BFS</strong> menjelajahi per level (lebar dulu), cocok untuk mencari jalur terpendek.
								<strong>DFS</strong> menjelajahi sampai ujung cabang dulu (dalam).
							</p>
							<div class="flex items-center gap-1.5 pt-2 border-t border-border/40">
								<svg class="w-3 h-3 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
								</svg>
								<span class="text-[10px] text-muted-foreground">Algoritma Bab 3.pdf · hal. 12–14</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Input -->
				<div class="mt-3 flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-2">
					<span class="flex-1 text-[11px] text-muted-foreground">Tanyakan dari materi kuliahmu...</span>
					<div class="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
						<svg class="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
							<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Floating stat card -->
	<div class="absolute -bottom-4 -left-4 hidden sm:block rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm px-4 py-3 shadow-lg">
		<p class="text-2xl font-semibold landing-serif text-foreground">3</p>
		<p class="text-[11px] text-muted-foreground">dokumen terindeks</p>
	</div>

	<div class="absolute -top-3 -right-3 hidden sm:block rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm px-4 py-3 shadow-lg">
		<p class="text-[11px] text-muted-foreground mb-0.5">Sumber jawaban</p>
		<p class="text-xs font-medium text-primary">Halaman 12–14</p>
	</div>
</div>

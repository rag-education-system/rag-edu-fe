<script lang="ts">
	const documents = [
		{ name: 'Algoritma Bab 3.pdf', pages: 24, active: true },
		{ name: 'Struktur_Data_Bab2.pdf', pages: 18, active: false },
		{ name: 'Basis_Data_Modul_4.pdf', pages: 32, active: false }
	];
</script>

<div class="relative w-full">
	<div
		class="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:ring-white/10"
	>
		<div class="flex items-center gap-3 border-b border-border/50 bg-muted/40 px-4 py-3">
			<div class="flex gap-1.5">
				<span class="h-3 w-3 rounded-full bg-red-400/80"></span>
				<span class="h-3 w-3 rounded-full bg-amber-400/80"></span>
				<span class="h-3 w-3 rounded-full bg-emerald-400/80"></span>
			</div>
			<div class="flex flex-1 items-center justify-center">
				<div class="flex h-7 w-full max-w-xs items-center rounded-lg bg-background/80 px-3">
					<span class="truncate text-xs text-muted-foreground">app.hattatik.ai/chat</span>
				</div>
			</div>
		</div>

		<div class="grid min-h-[300px] grid-cols-1 sm:grid-cols-5 sm:min-h-[340px]">
			<div class="hidden border-r border-border/50 bg-muted/20 p-3 sm:col-span-2 sm:block">
				<p class="mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					Materi Saya
				</p>
				<div class="space-y-2">
					{#each documents as doc}
						<div
							class="rounded-xl px-3 py-2.5 text-xs transition-colors {doc.active
								? 'border border-primary/25 bg-primary/10 text-foreground shadow-sm'
								: 'text-muted-foreground'}"
						>
							<p class="truncate font-medium">{doc.name}</p>
							<p class="mt-0.5 text-[10px] opacity-70">{doc.pages} halaman</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex flex-col p-4 sm:col-span-3">
				<div class="mb-3 flex items-center gap-2 border-b border-border/40 pb-3 sm:hidden">
					<div class="h-8 w-8 rounded-lg bg-primary/10"></div>
					<div>
						<p class="text-xs font-semibold">Tanya AI</p>
						<p class="text-[10px] text-muted-foreground">Algoritma Bab 3.pdf</p>
					</div>
				</div>

				<div class="flex-1 space-y-3">
					<div class="flex justify-end">
						<div class="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-xs leading-relaxed text-primary-foreground sm:text-sm">
							Apa perbedaan BFS dan DFS dari materi kita?
						</div>
					</div>

					<div class="rounded-2xl rounded-tl-sm border border-border/50 bg-background px-3.5 py-3 text-xs leading-relaxed sm:text-sm">
						<p>
							<strong class="text-foreground">BFS</strong> menjelajahi per level — cocok untuk jalur
							terpendek.
							<strong class="text-foreground">DFS</strong> menjelajahi sampai ujung cabang dulu.
						</p>
						<div
							class="mt-3 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-2"
						>
							<svg class="h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
							<span class="text-[11px] font-medium text-primary">Algoritma Bab 3.pdf · hal. 12–14</span>
						</div>
					</div>
				</div>

				<div class="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
					<span class="flex-1 text-xs text-muted-foreground">Tanyakan dari materi kuliahmu...</span>
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
						<svg class="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
							<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="absolute -bottom-5 -left-2 hidden rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm sm:block"
	>
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
				3
			</div>
			<div>
				<p class="text-sm font-semibold text-foreground">Dokumen terindeks</p>
				<p class="text-xs text-muted-foreground">Siap ditanyakan</p>
			</div>
		</div>
	</div>

	<div
		class="absolute -right-2 -top-4 hidden rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm sm:block"
	>
		<p class="text-xs text-muted-foreground">Sumber jawaban</p>
		<p class="mt-0.5 text-sm font-semibold text-primary">Halaman 12–14 ✓</p>
	</div>
</div>

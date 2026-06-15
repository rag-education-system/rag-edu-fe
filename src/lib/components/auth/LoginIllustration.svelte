<script lang="ts">
	import OrbitVisual from '$lib/components/landing/OrbitVisual.svelte';

	const pdfDocs = [
		{ name: 'Algoritma Bab 3.pdf', pages: 24 },
		{ name: 'Struktur Data.pdf', pages: 48 }
	];
</script>

<div class="relative w-full max-w-md mx-auto h-[260px] overflow-hidden">
	<!-- Glow latar -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-primary/8 blur-3xl pointer-events-none"
	></div>

	<!-- Orbit di tengah -->
	<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
		<div class="scale-[0.52] origin-center">
			<OrbitVisual />
		</div>
	</div>

	<!-- Kartu PDF -->
	<div
		class="absolute left-0 top-3 w-[148px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden animate-float z-10"
	>
		<div class="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-2">
			<div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
					/>
				</svg>
			</div>
			<span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PDF</span>
		</div>
		<div class="p-2 space-y-1.5">
			{#each pdfDocs as doc, i}
				<div
					class="rounded-lg px-2 py-1.5 text-xs leading-snug {i === 0
						? 'bg-primary/10 border border-primary/20 text-foreground'
						: 'text-muted-foreground'}"
				>
					<p class="font-medium truncate">{doc.name}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Kartu jawaban -->
	<div
		class="absolute right-0 top-1 w-[158px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg p-3 animate-float z-10"
		style="animation-delay: -2.5s;"
	>
		<p class="text-xs leading-relaxed text-foreground mb-2">
			<strong>BFS</strong> per level, <strong>DFS</strong> ke ujung cabang.
		</p>
		<div class="flex items-center gap-1.5 rounded-lg bg-primary/8 border border-primary/15 px-2 py-1.5">
			<svg class="h-3.5 w-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
			</svg>
			<span class="text-[11px] text-primary font-medium truncate">Bab 3 · h.12</span>
		</div>
	</div>

	<!-- Stat pill -->
	<div
		class="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full border border-border/60 bg-card/90 backdrop-blur-sm px-5 py-2 shadow-md z-10"
	>
		<div class="text-center">
			<p class="text-sm font-semibold text-foreground">PDF</p>
		</div>
		<div class="h-5 w-px bg-border/50"></div>
		<div class="text-center">
			<p class="text-sm font-semibold text-primary">hal. 12</p>
		</div>
		<div class="h-5 w-px bg-border/50"></div>
		<div class="text-center">
			<p class="text-sm font-semibold text-foreground">3 dokumen</p>
		</div>
	</div>
</div>

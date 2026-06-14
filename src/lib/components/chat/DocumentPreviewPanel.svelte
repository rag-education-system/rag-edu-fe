<script lang="ts">
	import { cn } from '$lib/utils';
	import type { DocumentPreviewData } from '$lib/types/document-preview';

	let {
		open = false,
		loading = false,
		error = '',
		preview = null,
		highlightChunkIndex = 0,
		onClose
	}: {
		open?: boolean;
		loading?: boolean;
		error?: string;
		preview?: DocumentPreviewData | null;
		highlightChunkIndex?: number;
		onClose?: () => void;
	} = $props();

	let scrollContainer = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!open || loading || !preview || !scrollContainer) return;

		const target = scrollContainer.querySelector(`[data-chunk-index="${highlightChunkIndex}"]`);
		if (target instanceof HTMLElement) {
			requestAnimationFrame(() => {
				target.scrollIntoView({ behavior: 'smooth', block: 'center' });
			});
		}
	});
</script>

{#if open}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/50 lg:hidden"
		onclick={() => onClose?.()}
		aria-label="Tutup preview"
	></button>

	<aside
		class={cn(
			'fixed inset-0 z-50 flex flex-col bg-card/95 backdrop-blur-xl lg:static lg:inset-auto lg:max-w-lg lg:shrink-0 lg:border-l lg:border-border/50 lg:shadow-none',
			'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
		)}
		aria-label="Preview dokumen"
	>
		<div class="flex items-start justify-between gap-3 border-b border-border/50 px-4 py-3 sm:py-4">
			<div class="min-w-0 flex-1">
				<p class="text-xs font-semibold uppercase tracking-wider text-primary">Preview Dokumen</p>
				<h2 class="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
					{preview?.document.originalName ?? 'Memuat dokumen...'}
				</h2>
				{#if preview?.document.mimeType}
					<p class="mt-1 text-[11px] text-muted-foreground sm:text-xs">
						{preview.document.mimeType} · {preview.chunks.length} bagian teks
					</p>
				{/if}
			</div>

			<button
				type="button"
				onclick={() => onClose?.()}
				class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/50 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
				aria-label="Tutup preview"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div bind:this={scrollContainer} class="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
			{#if loading}
				<div class="flex min-h-48 items-center justify-center">
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Memuat isi dokumen...
					</div>
				</div>
			{:else if error}
				<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</div>
			{:else if preview}
				<div class="space-y-3">
					{#each preview.chunks as chunk (chunk.chunkIndex)}
						<section
							data-chunk-index={chunk.chunkIndex}
							class={cn(
								'rounded-xl border px-3 py-3 transition-all duration-300 sm:px-4',
								chunk.chunkIndex === highlightChunkIndex
									? 'border-primary/50 bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/10'
									: 'border-border/50 bg-background/40'
							)}
						>
							<div class="mb-2 flex items-center justify-between gap-2">
								<span class="text-xs font-semibold text-muted-foreground">
									Bagian {chunk.chunkIndex + 1}
								</span>
								{#if chunk.chunkIndex === highlightChunkIndex}
									<span class="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
										Bagian relevan
									</span>
								{/if}
							</div>
							<p class="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
								{chunk.content}
							</p>
						</section>
					{/each}
				</div>
			{/if}
		</div>
	</aside>
{/if}

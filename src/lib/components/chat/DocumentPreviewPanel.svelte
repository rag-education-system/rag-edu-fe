<script lang="ts">
	import { cn } from '$lib/utils';
	import type { DocumentItemDto } from '$lib/types/api';
	import PdfViewer from './PdfViewer.svelte';

	let {
		open = false,
		loading = false,
		error = '',
		document = null,
		highlightPageNumber = 1,
		highlightSnippet = '',
		onClose
	}: {
		open?: boolean;
		loading?: boolean;
		error?: string;
		document?: DocumentItemDto | null;
		highlightPageNumber?: number;
		highlightSnippet?: string;
		onClose?: () => void;
	} = $props();

	const mimeType = $derived((document?.mimeType ?? '').toLowerCase());
	const fileName = $derived((document?.originalName ?? document?.filename ?? '').toLowerCase());
	const isPdf = $derived(mimeType === 'application/pdf' || fileName.endsWith('.pdf'));
	const isImage = $derived(
		mimeType.startsWith('image/') ||
			/\.(png|jpe?g|webp|gif)$/i.test(fileName)
	);

	const fileUrl = $derived(
		document?.id ? `/api/documents/${document.id}/download?inline=1` : ''
	);

	const relevantPage = $derived(highlightPageNumber > 0 ? highlightPageNumber : 1);
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
			'fixed inset-0 z-50 flex flex-col bg-card/95 backdrop-blur-xl lg:static lg:inset-auto lg:max-w-xl lg:shrink-0 lg:border-l lg:border-border/50 lg:shadow-none',
			'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
		)}
		aria-label="Preview dokumen"
	>
		<div class="flex items-start justify-between gap-3 border-b border-border/50 px-4 py-3 sm:py-4">
			<div class="min-w-0 flex-1">
				<p class="text-xs font-semibold uppercase tracking-wider text-primary">Preview Dokumen</p>
				<h2 class="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
					{document?.originalName ?? 'Memuat dokumen...'}
				</h2>
				{#if document?.mimeType}
					<p class="mt-1 text-[11px] text-muted-foreground sm:text-xs">
						{document.mimeType}
						{#if isPdf && relevantPage > 0}
							· Halaman {relevantPage}
						{/if}
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

		{#if !loading && !error && document && highlightSnippet}
			<div class="shrink-0 border-b border-primary/20 bg-primary/5 px-3 py-3 sm:px-4">
				<div class="mb-1 flex items-center gap-2">
					<span class="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
						Bagian relevan
					</span>
				</div>
				<p class="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
					{highlightSnippet}
				</p>
			</div>
		{/if}

		<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
			{#if loading}
				<div class="flex min-h-48 flex-1 items-center justify-center px-4">
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Memuat file dokumen...
					</div>
				</div>
			{:else if error}
				<div class="px-3 py-3 sm:px-4">
					<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				</div>
			{:else if document}
				{#if isPdf && fileUrl}
					{#key document.id}
						<PdfViewer
							url={fileUrl}
							initialPage={relevantPage}
							title="Preview PDF {document.originalName}"
						/>
					{/key}
					<div class="shrink-0 border-t border-border/50 px-3 py-2 text-center">
						<a
							href="{fileUrl}#page={relevantPage}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-xs text-primary hover:underline"
						>
							Buka PDF di tab baru (hal. {relevantPage})
						</a>
					</div>
				{:else if isImage && fileUrl}
					<div class="flex flex-1 items-start justify-center overflow-auto bg-muted/20 p-3 sm:p-4">
						<img
							src={fileUrl}
							alt={document.originalName}
							class="max-h-full w-full rounded-xl border border-border/50 object-contain shadow-sm"
						/>
					</div>
				{:else}
					<div class="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
						<p class="text-sm text-muted-foreground">
							Preview tidak tersedia untuk tipe file ini.
						</p>
						{#if fileUrl}
							<a
								href={fileUrl}
								download={document.originalName}
								class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>
								Unduh File
							</a>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</aside>
{/if}

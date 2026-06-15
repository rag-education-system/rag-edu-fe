<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import type { PluginRegistry } from '@embedpdf/snippet';
	import type { Component } from 'svelte';

	let {
		url,
		initialPage = 1,
		title = 'Preview PDF'
	}: {
		url: string;
		initialPage?: number;
		title?: string;
	} = $props();

	let loading = $state(true);
	let error = $state('');
	let pdfBlobUrl = $state('');
	let PDFViewerComponent = $state<Component<any> | null>(null);
	let currentPage = $state(1);
	let totalPages = $state(0);

	onMount(() => {
		if (!browser || !url) return;
		loadPdf();
	});

	onDestroy(() => {
		if (pdfBlobUrl) {
			URL.revokeObjectURL(pdfBlobUrl);
		}
	});

	async function loadPdf() {
		try {
			console.log('[PdfViewer] Fetching PDF from:', url);
			
			const response = await fetch(url);
			console.log('[PdfViewer] Response status:', response.status);
			
			if (!response.ok) {
				const contentType = response.headers.get('Content-Type') || '';
				if (contentType.includes('application/json')) {
					const data = await response.json().catch(() => ({}));
					throw new Error((data as { error?: string }).error || `HTTP ${response.status}`);
				}
				throw new Error(`Gagal memuat PDF: HTTP ${response.status}`);
			}

			const blob = await response.blob();
			console.log('[PdfViewer] Blob size:', blob.size, 'type:', blob.type);
			
			if (blob.size === 0) {
				throw new Error('File PDF kosong');
			}

			pdfBlobUrl = URL.createObjectURL(blob);
			console.log('[PdfViewer] Created blob URL:', pdfBlobUrl);

			const module = await import('@embedpdf/svelte-pdf-viewer');
			PDFViewerComponent = module.PDFViewer as Component<any>;
			
		} catch (err) {
			console.error('[PdfViewer] Error:', err);
			error = err instanceof Error ? err.message : 'Gagal memuat PDF';
			loading = false;
		}
	}

	function handleReady(registry: PluginRegistry) {
		console.log('[PdfViewer] PDF viewer ready', registry);
		loading = false;

		try {
			const scrollPlugin = registry.getCapabilityProvider('scroll');
			
			if (scrollPlugin && typeof scrollPlugin.provides === 'function') {
				const scrollCapability = scrollPlugin.provides() as any;
				
				if (scrollCapability && typeof scrollCapability.scrollToPage === 'function') {
					totalPages = scrollCapability.getTotalPages?.() || 0;
					currentPage = scrollCapability.getCurrentPage?.() || 1;

					console.log('[PdfViewer] Total pages:', totalPages, 'Current:', currentPage, 'Target:', initialPage);

					if (initialPage > 1 && initialPage <= totalPages) {
						setTimeout(() => {
							console.log('[PdfViewer] Navigating to page:', initialPage);
							scrollCapability.scrollToPage({
								pageNumber: initialPage,
								behavior: 'smooth',
								alignY: 0
							});
						}, 500);
					}

					scrollCapability.onPageChange?.((event: { pageNumber: number; totalPages: number }) => {
						currentPage = event.pageNumber;
						totalPages = event.totalPages;
					});
				}
			}
		} catch (err) {
			console.warn('[PdfViewer] Could not setup page navigation:', err);
		}
	}
</script>

<div class="flex min-h-0 flex-1 flex-col bg-muted/20">
	{#if initialPage > 1}
		<div class="shrink-0 border-b border-primary/20 bg-primary/5 px-3 py-2 text-center">
			<span class="text-xs text-primary">
				Mengarahkan ke halaman {initialPage}
				{#if totalPages > 0}
					dari {totalPages}
				{/if}
			</span>
		</div>
	{/if}

	<div class="relative flex min-h-0 flex-1 flex-col">
		{#if loading && !error}
			<div class="absolute inset-0 z-10 flex items-center justify-center bg-muted/50">
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Memuat PDF...
				</div>
			</div>
		{/if}

		{#if error}
			<div class="flex flex-1 items-center justify-center p-4">
				<div class="text-center">
					<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-3 inline-block text-xs text-primary hover:underline"
					>
						Coba buka PDF di tab baru
					</a>
				</div>
			</div>
		{:else if PDFViewerComponent && pdfBlobUrl}
			<PDFViewerComponent
				config={{ src: pdfBlobUrl }}
				style="height: 100%; min-height: 400px; flex: 1;"
				onready={handleReady}
			/>
		{/if}
	</div>
</div>

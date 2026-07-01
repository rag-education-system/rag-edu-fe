<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import type { Component } from 'svelte';
	import type { PluginRegistry } from '@embedpdf/snippet';
	import type { FullscreenCapability } from '@embedpdf/plugin-fullscreen';

	export type PdfFullscreenControl = {
		toggle: () => void;
		isFullscreen: () => boolean;
	};

	let {
		url,
		initialPage = 1,
		title = 'Preview PDF',
		onFullscreenReady,
		onFullscreenChange
	}: {
		url: string;
		initialPage?: number;
		title?: string;
		onFullscreenReady?: (control: PdfFullscreenControl | null) => void;
		onFullscreenChange?: (isFullscreen: boolean) => void;
	} = $props();

	type ScrollApi = {
		getTotalPages?: () => number;
		getCurrentPage?: () => number;
		scrollToPage?: (options: {
			pageNumber: number;
			behavior?: 'instant' | 'smooth' | 'auto';
			alignY?: number;
		}) => void;
		forDocument?: (documentId: string) => ScrollApi;
		getLayout?: () => { virtualItems?: unknown[] };
		getMetrics?: () => {
			currentPage: number;
			visiblePages?: number[];
		};
		onLayoutReady?: (
			listener: (event: {
				documentId: string;
				isInitial: boolean;
				pageNumber: number;
				totalPages: number;
			}) => void
		) => () => void;
		onLayoutChange?: (
			listener: (event: {
				documentId: string;
				layout: { virtualItems?: unknown[] };
			}) => void
		) => () => void;
		onScroll?: (
			listener: (event: {
				documentId: string;
				metrics: { currentPage: number; visiblePages?: number[] };
			}) => void
		) => () => void;
		onPageChange?: (
			listener: (event: { pageNumber: number; totalPages: number }) => void
		) => () => void;
	};

	type DocumentManagerApi = {
		getActiveDocumentId?: () => string | null;
		onDocumentOpened?: (
			listener: (event: { id: string; status: string }) => void
		) => () => void;
	};

	let loading = $state(true);
	let error = $state('');
	let pdfBlobUrl = $state('');
	let PDFViewerComponent = $state<Component<any> | null>(null);
	let currentPage = $state(1);
	let totalPages = $state(0);

	let registryRef: PluginRegistry | null = null;
	let layoutReadyUnsub: (() => void) | null = null;
	let layoutChangeUnsub: (() => void) | null = null;
	let scrollUnsub: (() => void) | null = null;
	let pageChangeUnsub: (() => void) | null = null;
	let documentOpenedUnsub: (() => void) | null = null;
	let fullscreenUnsub: (() => void) | null = null;
	let navigatedPage = 0;
	let pendingPage = 0;
	let navigateTimers: ReturnType<typeof setTimeout>[] = [];

	onMount(() => {
		if (!browser || !url) return;
		loadPdf();
	});

	onDestroy(() => {
		clearNavigateTimers();
		layoutReadyUnsub?.();
		layoutChangeUnsub?.();
		scrollUnsub?.();
		pageChangeUnsub?.();
		documentOpenedUnsub?.();
		fullscreenUnsub?.();
		onFullscreenReady?.(null);
		if (pdfBlobUrl) {
			URL.revokeObjectURL(pdfBlobUrl);
		}
	});

	$effect(() => {
		const targetPage = initialPage;
		if (!registryRef || targetPage < 1) return;
		if (targetPage === navigatedPage) return;
		pendingPage = targetPage;
		navigatedPage = 0;
		scheduleNavigate(targetPage);
	});

	function clearNavigateTimers() {
		for (const timer of navigateTimers) {
			clearTimeout(timer);
		}
		navigateTimers = [];
	}

	function getScrollApi(registry: PluginRegistry): ScrollApi | null {
		const plugin = registry.getCapabilityProvider('scroll');
		if (!plugin || typeof plugin.provides !== 'function') return null;
		return plugin.provides() as ScrollApi;
	}

	function getDocumentManagerApi(registry: PluginRegistry): DocumentManagerApi | null {
		const plugin = registry.getCapabilityProvider('document-manager');
		if (!plugin || typeof plugin.provides !== 'function') return null;
		return plugin.provides() as DocumentManagerApi;
	}

	function resolveScrollScope(registry: PluginRegistry, documentId?: string): ScrollApi | null {
		const scroll = getScrollApi(registry);
		if (!scroll) return null;

		const activeDocumentId =
			documentId ?? getDocumentManagerApi(registry)?.getActiveDocumentId?.() ?? undefined;

		if (activeDocumentId && scroll.forDocument) {
			return scroll.forDocument(activeDocumentId);
		}

		return scroll;
	}

	function isLayoutReady(scope: ScrollApi): boolean {
		const maxPages = scope.getTotalPages?.() ?? 0;
		if (maxPages === 0) return false;

		try {
			const layout = scope.getLayout?.();
			return (layout?.virtualItems?.length ?? 0) > 0;
		} catch {
			return false;
		}
	}

	function isPageVisible(scope: ScrollApi, page: number): boolean {
		try {
			const metrics = scope.getMetrics?.();
			if (!metrics) return false;
			if (metrics.currentPage === page) return true;
			return metrics.visiblePages?.includes(page) ?? false;
		} catch {
			return false;
		}
	}

	function markNavigated(page: number) {
		currentPage = page;
		navigatedPage = page;
		pendingPage = 0;
		clearNavigateTimers();
	}

	function navigateToPage(page: number, documentId?: string): boolean {
		if (!registryRef || page < 1) return false;

		try {
			const scope = resolveScrollScope(registryRef, documentId);
			if (!scope?.scrollToPage) return false;
			if (!isLayoutReady(scope)) return false;

			const maxPages = scope.getTotalPages?.() ?? totalPages;
			const targetPage = maxPages > 0 ? Math.min(page, maxPages) : page;

			if (isPageVisible(scope, targetPage)) {
				markNavigated(targetPage);
				return true;
			}

			console.log('[PdfViewer] Navigating to page:', targetPage, 'documentId:', documentId);
			scope.scrollToPage({
				pageNumber: targetPage,
				behavior: 'instant',
				alignY: 0
			});

			return isPageVisible(scope, targetPage);
		} catch (err) {
			console.warn('[PdfViewer] navigateToPage failed:', err);
			return false;
		}
	}

	function tryConfirmNavigation(page: number, documentId?: string) {
		if (!registryRef || page < 1 || navigatedPage === page) return;

		const scope = resolveScrollScope(registryRef, documentId);
		if (!scope || !isPageVisible(scope, page)) return;

		console.log('[PdfViewer] Confirmed on page:', page);
		markNavigated(page);
	}

	function scheduleNavigate(page: number) {
		clearNavigateTimers();
		if (page < 1) return;

		const attempt = () => {
			navigateToPage(page);
			tryConfirmNavigation(page);
		};

		const delays = [0, 200, 500, 1000, 2000, 3500, 5000];
		for (const delay of delays) {
			navigateTimers.push(setTimeout(attempt, delay));
		}
	}

	function requestNavigate(page: number, documentId?: string) {
		if (page < 1) return;
		pendingPage = page;
		navigateToPage(page, documentId);
		tryConfirmNavigation(page, documentId);
		if (navigatedPage !== page) {
			scheduleNavigate(page);
		}
	}

	function setupNavigation(registry: PluginRegistry) {
		registryRef = registry;
		const scroll = getScrollApi(registry);
		if (!scroll) return;

		const docMgr = getDocumentManagerApi(registry);

		layoutReadyUnsub?.();
		layoutChangeUnsub?.();
		scrollUnsub?.();
		pageChangeUnsub?.();
		documentOpenedUnsub?.();

		layoutReadyUnsub =
			scroll.onLayoutReady?.((event) => {
				totalPages = event.totalPages;
				console.log('[PdfViewer] Layout ready:', event);
				const target = pendingPage > 0 ? pendingPage : initialPage;
				if (target > 0) {
					requestNavigate(target, event.documentId);
				}
			}) ?? null;

		layoutChangeUnsub =
			scroll.onLayoutChange?.((event) => {
				const target = pendingPage > 0 ? pendingPage : initialPage;
				if (target > 0 && navigatedPage !== target) {
					navigateToPage(target, event.documentId);
					tryConfirmNavigation(target, event.documentId);
				}
			}) ?? null;

		scrollUnsub =
			scroll.onScroll?.((event) => {
				const target = pendingPage > 0 ? pendingPage : initialPage;
				if (target > 0) {
					tryConfirmNavigation(target, event.documentId);
				}
			}) ?? null;

		pageChangeUnsub =
			scroll.onPageChange?.((event) => {
				totalPages = event.totalPages;
				const target = pendingPage > 0 ? pendingPage : initialPage;
				if (event.pageNumber === target) {
					currentPage = event.pageNumber;
				}
			}) ?? null;

		documentOpenedUnsub =
			docMgr?.onDocumentOpened?.((doc) => {
				if (doc.status !== 'loaded') return;
				const target = pendingPage > 0 ? pendingPage : initialPage;
				if (target > 0) {
					requestNavigate(target, doc.id);
				}
			}) ?? null;

		pendingPage = initialPage > 0 ? initialPage : 0;
		requestNavigate(initialPage);
	}

	async function loadPdf() {
		loading = true;
		error = '';
		navigatedPage = 0;
		pendingPage = initialPage > 0 ? initialPage : 0;
		registryRef = null;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				const contentType = response.headers.get('Content-Type') || '';
				if (contentType.includes('application/json')) {
					const data = await response.json().catch(() => ({}));
					throw new Error((data as { error?: string }).error || `HTTP ${response.status}`);
				}
				throw new Error(`Gagal memuat PDF: HTTP ${response.status}`);
			}

			const blob = await response.blob();
			if (blob.size === 0) {
				throw new Error('File PDF kosong');
			}

			if (pdfBlobUrl) {
				URL.revokeObjectURL(pdfBlobUrl);
			}
			pdfBlobUrl = URL.createObjectURL(blob);

			const module = await import('@embedpdf/svelte-pdf-viewer');
			PDFViewerComponent = module.PDFViewer as Component<any>;
		} catch (err) {
			console.error('[PdfViewer] Error:', err);
			error = err instanceof Error ? err.message : 'Gagal memuat PDF';
			loading = false;
		}
	}

	function setupFullscreen(registry: PluginRegistry) {
		fullscreenUnsub?.();
		onFullscreenReady?.(null);

		const plugin = registry.getPlugin('fullscreen');
		const capability = plugin?.provides?.() as FullscreenCapability | undefined;
		if (!capability) return;

		const control: PdfFullscreenControl = {
			toggle: () => capability.toggleFullscreen(),
			isFullscreen: () => capability.isFullscreen()
		};

		onFullscreenReady?.(control);
		onFullscreenChange?.(capability.isFullscreen());
		fullscreenUnsub = capability.onStateChange((state) => {
			onFullscreenChange?.(state.isFullscreen);
		}) ?? null;
	}

	function handleReady(registry: PluginRegistry) {
		console.log('[PdfViewer] PDF viewer ready');
		loading = false;
		setupNavigation(registry);
		setupFullscreen(registry);
	}
</script>

<div class="flex min-h-0 flex-1 flex-col bg-muted/20">
	{#if initialPage > 1}
		<div class="shrink-0 border-b border-primary/20 bg-primary/5 px-3 py-2 text-center">
			<span class="text-xs text-primary">
				Halaman relevan: {initialPage}
				{#if totalPages > 0}
					· total {totalPages} halaman
				{:else if currentPage > 0}
					· sedang di hal. {currentPage}
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
				config={{ src: pdfBlobUrl, disabledCategories: ['document-fullscreen'] }}
				style="height: 100%; min-height: 400px; flex: 1;"
				onready={handleReady}
			/>
		{/if}
	</div>
</div>

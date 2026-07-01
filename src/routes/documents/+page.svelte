<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import EmptyState from '$lib/components/dashboard/EmptyState.svelte';
	import { formatBytes, formatRelativeTime, formatDocumentName } from '$lib/utils/format';
	import { formatUploaderName, getRoleBadgeVariant, getRoleLabel } from '$lib/utils/user';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	import {
		DOCUMENT_STATUS_LABELS,
		DOCUMENT_STATUS_VARIANTS,
		DOCUMENT_VISIBILITY_LABELS,
		isDocumentStatus,
		isDocumentVisibility
	} from '$lib/types/api';

	let { data }: { data: PageData } = $props();

	const statusOptions = [
		{ value: null, label: 'Semua' },
		{ value: 'COMPLETED', label: 'Selesai' },
		{ value: 'PROCESSING', label: 'Diproses' },
		{ value: 'FAILED', label: 'Gagal' }
	] as const;

	const activeStatus = $derived(data.filters.status ?? null);

	function isFilterActive(value: string | null) {
		return activeStatus === value;
	}

	function handleFilterChange(status: string | null) {
		const url = new URL(page.url);
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
		}
		url.searchParams.set('page', '1');
		goto(`${url.pathname}?${url.searchParams.toString()}`, { keepFocus: true, noScroll: true });
	}

	function handlePageChange(newPage: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', newPage.toString());
		goto(`${url.pathname}?${url.searchParams.toString()}`, { keepFocus: true });
	}

	const hasDocuments = $derived((data.documents?.length ?? 0) > 0);
	const meta = $derived({
		total: data.meta?.total ?? 0,
		page: data.meta?.page ?? 1,
		limit: data.meta?.limit ?? 10,
		totalPages: data.meta?.totalPages ?? 0
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Dokumen</h1>
			<p class="text-muted-foreground mt-1">Kelola semua dokumen yang telah Anda upload.</p>
		</div>
		<Button href="/documents/upload" class="gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Upload Dokumen
		</Button>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-2">
		{#each statusOptions as option}
			<button
				type="button"
				class={cn(
					'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
					isFilterActive(option.value)
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
				)}
				aria-pressed={isFilterActive(option.value)}
				onclick={() => handleFilterChange(option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>

	<!-- Error State -->
	{#if data.error}
		<div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
			<p class="font-medium text-destructive">Error</p>
			<p class="text-sm text-destructive/80 mt-1">{data.error}</p>
		</div>
	{/if}

	<!-- Documents List -->
	{#if hasDocuments}
		<div class="rounded-xl border border-border bg-card/50 overflow-hidden">
			<!-- Table Header -->
			<div
				class="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground"
			>
				<div class="col-span-4">Nama File</div>
				<div class="col-span-2">Pengunggah</div>
				<div class="col-span-2">Ukuran</div>
				<div class="col-span-2">Status</div>
				<div class="col-span-1">Visibilitas</div>
				<div class="col-span-1"></div>
			</div>

			<!-- Table Body -->
			<div class="divide-y divide-border">
				{#each data.documents ?? [] as document}
					{@const status = isDocumentStatus(document.status) ? document.status : 'PROCESSING'}
					{@const visibility = isDocumentVisibility(document.visibility) ? document.visibility : 'PRIVATE'}
					{@const uploaderName = formatUploaderName(document, data.user?.id)}
					<div
						class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 hover:bg-muted/30 transition-colors"
					>
						<!-- File Info -->
						<div class="sm:col-span-4">
							<div class="flex items-center gap-3">
								<div
									class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
								>
									{#if document.mimeType === 'application/pdf'}
										<svg
											class="w-5 h-5 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									{:else}
										<svg
											class="w-5 h-5 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									{/if}
								</div>
								<div class="min-w-0">
									<p class="font-medium text-foreground truncate">
										{formatDocumentName(document.originalName)}
									</p>
									<p class="text-xs text-muted-foreground">
										{document.createdAt ? formatRelativeTime(document.createdAt) : '-'} &bull;
										{document.totalChunks ?? 0} chunks
									</p>
									<p class="mt-1 text-xs text-muted-foreground sm:hidden">
										Diunggah oleh {uploaderName}
										{#if document.uploaderRole}
											&bull; {getRoleLabel(document.uploaderRole)}
										{/if}
									</p>
								</div>
							</div>
						</div>

						<!-- Uploader -->
						<div class="hidden sm:flex sm:col-span-2 sm:flex-col sm:justify-center sm:gap-1">
							<span class="text-sm font-medium text-foreground truncate" title={uploaderName}>
								{uploaderName}
							</span>
							{#if document.uploaderRole}
								<Badge variant={getRoleBadgeVariant(document.uploaderRole)} class="w-fit text-xs">
									{getRoleLabel(document.uploaderRole)}
								</Badge>
							{/if}
						</div>

						<!-- Size -->
						<div class="sm:col-span-2 flex items-center">
							<span class="text-sm text-muted-foreground sm:text-foreground">
								<span class="sm:hidden text-muted-foreground">Ukuran: </span>
								{formatBytes(document.fileSize ?? 0)}
							</span>
						</div>

						<!-- Status -->
						<div class="sm:col-span-2 flex items-center">
							<Badge variant={DOCUMENT_STATUS_VARIANTS[status]}>
								{DOCUMENT_STATUS_LABELS[status]}
							</Badge>
						</div>

						<!-- Visibility -->
						<div class="sm:col-span-1 flex items-center">
							<span
								class="inline-flex items-center gap-1.5 text-sm {visibility === 'PUBLIC'
									? 'text-green-600'
									: 'text-muted-foreground'}"
							>
								{#if visibility === 'PUBLIC'}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								{:else}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								{/if}
								{DOCUMENT_VISIBILITY_LABELS[visibility]}
							</span>
						</div>

						<!-- Actions -->
						<div class="sm:col-span-1 flex items-center justify-end">
							<Button href="/documents/{document.id}" variant="ghost" size="sm">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Pagination -->
		{#if meta.totalPages > 1}
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p class="text-sm text-muted-foreground">
					Menampilkan {(meta.page - 1) * meta.limit + 1} -
					{Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} dokumen
				</p>
				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={meta.page <= 1}
						onclick={() => handlePageChange(meta.page - 1)}
					>
						<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Prev
					</Button>
					<span class="text-sm text-muted-foreground px-2">
						{meta.page} / {meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={meta.page >= meta.totalPages}
						onclick={() => handlePageChange(meta.page + 1)}
					>
						Next
						<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				</div>
			</div>
		{/if}
	{:else if !data.error}
		<EmptyState
			title={activeStatus ? 'Tidak ada dokumen dengan filter ini' : 'Belum ada dokumen'}
			description={activeStatus
				? 'Coba pilih filter lain atau upload dokumen baru.'
				: 'Upload dokumen pertama Anda untuk mulai menggunakan sistem RAG'}
			actionText="Upload Dokumen"
			actionHref="/documents/upload"
		/>
	{/if}
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import EnhancedStatCard from '$lib/components/dashboard/EnhancedStatCard.svelte';
	import DocumentListItem from '$lib/components/dashboard/DocumentListItem.svelte';
	import EmptyState from '$lib/components/dashboard/EmptyState.svelte';
	import { formatBytes } from '$lib/utils/format';

	let { data }: { data: PageData } = $props();

	const hasDocuments = $derived(data.documents.length > 0);
</script>

{#snippet DocumentIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

{#snippet CheckIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
{/snippet}

{#snippet ProcessIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
		/>
	</svg>
{/snippet}

{#snippet StorageIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
		/>
	</svg>
{/snippet}

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
			<p class="text-muted-foreground mt-1">Kelola dan pantau dokumen Anda dengan mudah.</p>
		</div>
		<div class="flex items-center gap-3">
			<Button href="/documents/upload" class="gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Upload Dokumen
			</Button>
			<Button variant="outline" href="/query" class="gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
				Tanya AI
			</Button>
		</div>
	</div>

	<!-- Statistics Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<EnhancedStatCard
			title="Total Dokumen"
			value={data.statistics.totalDocuments}
			icon={DocumentIcon}
			variant="primary"
			description="Semua dokumen"
		/>
		<EnhancedStatCard
			title="Selesai"
			value={data.statistics.completed}
			icon={CheckIcon}
			variant="success"
			description="Siap digunakan"
		/>
		<EnhancedStatCard
			title="Sedang Diproses"
			value={data.statistics.processing}
			icon={ProcessIcon}
			variant="warning"
			description="Dalam antrian"
		/>
		<EnhancedStatCard
			title="Penyimpanan"
			value={formatBytes(data.statistics.totalStorage)}
			icon={StorageIcon}
			variant="default"
			description="Total penggunaan"
		/>
	</div>

	<!-- Recent Documents -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-foreground">Dokumen Terbaru</h2>
			{#if hasDocuments}
				<Button href="/documents" variant="ghost" size="sm">
					Lihat Semua
					<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</Button>
			{/if}
		</div>

		{#if data.error}
			<div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
				<p class="font-medium text-destructive">Error memuat dashboard</p>
				<p class="text-sm text-destructive/80 mt-1">{data.error}</p>
			</div>
		{/if}

		{#if hasDocuments}
			<div class="rounded-xl border border-border bg-card/50 divide-y divide-border overflow-hidden">
				{#each data.documents as document}
					<DocumentListItem {document} />
				{/each}
			</div>
		{:else}
			<EmptyState
				title="Belum ada dokumen"
				description="Upload dokumen pertama Anda untuk mulai menggunakan sistem RAG kami"
				actionText="Upload Dokumen"
				actionHref="/documents/upload"
			/>
		{/if}
	</div>
</div>

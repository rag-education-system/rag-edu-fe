<script lang="ts">
	import type { PageData } from './$types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import DocumentListItem from '$lib/components/dashboard/DocumentListItem.svelte';
	import EmptyState from '$lib/components/dashboard/EmptyState.svelte';
	import { formatBytes } from '$lib/utils/format';

	let { data }: { data: PageData } = $props();

	const hasDocuments = $derived(data.documents.length > 0);
</script>

<div class="container mx-auto max-w-7xl px-4 py-8">
	<!-- Welcome Section -->
	<div class="space-y-4 mb-8">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold">Selamat datang, {data.user.name}!</h1>
				<p class="text-muted-foreground mt-1">Berikut ringkasan dokumen Anda</p>
			</div>
			<Badge variant={data.user.role === 'ADMIN' ? 'destructive' : 'default'}>
				{data.user.role}
			</Badge>
		</div>
	</div>

	<!-- Statistics Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
		<StatCard title="Total Dokumen" value={data.statistics.totalDocuments} />
		<StatCard
			title="Sedang Diproses"
			value={data.statistics.processing}
			variant="warning"
		/>
		<StatCard title="Selesai" value={data.statistics.completed} variant="success" />
		<StatCard title="Penyimpanan" value={formatBytes(data.statistics.totalStorage)} />
	</div>

	<Separator class="my-8" />

	<!-- Quick Actions -->
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4">Aksi Cepat</h2>
		<div class="flex flex-col sm:flex-row gap-4">
			<Button href="/documents/upload" size="lg" class="flex-1 sm:flex-none">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				Upload Dokumen
			</Button>
			<Button href="/query" variant="outline" size="lg" class="flex-1 sm:flex-none">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Tanya Dokumen
			</Button>
		</div>
	</div>

	<Separator class="my-8" />

	<!-- Recent Documents -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-semibold">Dokumen Terbaru</h2>
			{#if hasDocuments}
				<Button href="/documents" variant="ghost"> Lihat Semua → </Button>
			{/if}
		</div>

		{#if data.error}
			<div class="rounded-md bg-destructive/10 p-4 text-destructive">
				<p class="font-medium">Error memuat dashboard</p>
				<p class="text-sm">{data.error}</p>
			</div>
		{/if}

		{#if hasDocuments}
			<div class="space-y-2">
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

<script lang="ts">
	import type { DocumentItemDto } from '$lib/types/api';
	import {
		DOCUMENT_STATUS_LABELS,
		DOCUMENT_STATUS_VARIANTS,
		isDocumentStatus
	} from '$lib/types/api';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatBytes, formatRelativeTime } from '$lib/utils/format';

	let {
		document
	}: {
		document: DocumentItemDto;
	} = $props();

	const status = $derived(isDocumentStatus(document.status) ? document.status : 'PROCESSING');
</script>

<div
	class="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
>
	<div class="flex-1 min-w-0">
		<div class="flex flex-wrap items-center gap-2">
			<p class="font-medium truncate">{document.originalName ?? 'Dokumen'}</p>
			<Badge variant={DOCUMENT_STATUS_VARIANTS[status]} class="shrink-0">
				{DOCUMENT_STATUS_LABELS[status]}
			</Badge>
		</div>
		<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
			<span>{document.createdAt ? formatRelativeTime(document.createdAt) : '-'}</span>
			<span>{formatBytes(document.fileSize ?? 0)}</span>
			<span>{document.totalChunks ?? 0} chunks</span>
		</div>
	</div>
	<div class="flex shrink-0 gap-2">
		{#if document.id}
			<Button href="/documents/{document.id}" variant="ghost" size="sm">Detail</Button>
		{/if}
	</div>
</div>

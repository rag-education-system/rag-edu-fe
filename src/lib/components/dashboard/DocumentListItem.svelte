<script lang="ts">
	import type { DocumentItemDto } from '$lib/api/api';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatBytes, formatRelativeTime } from '$lib/utils/format';

	let {
		document
	}: {
		document: DocumentItemDto;
	} = $props();

	const statusVariants = {
		PROCESSING: 'secondary',
		COMPLETED: 'default',
		FAILED: 'destructive'
	} as const;

	const statusLabels = {
		PROCESSING: 'Memproses',
		COMPLETED: 'Selesai',
		FAILED: 'Gagal'
	};
</script>

<div
	class="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
>
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-2">
			<p class="font-medium truncate">{document.originalName}</p>
			<Badge variant={statusVariants[document.status]}>
				{statusLabels[document.status]}
			</Badge>
		</div>
		<div class="flex gap-4 mt-1 text-sm text-muted-foreground">
			<span>{formatRelativeTime(document.createdAt)}</span>
			<span>{formatBytes(document.fileSize)}</span>
			<span>{document.totalChunks} chunks</span>
		</div>
	</div>
	<div class="flex gap-2">
		<Button href="/documents/{document.id}" variant="ghost" size="sm">Detail</Button>
	</div>
</div>

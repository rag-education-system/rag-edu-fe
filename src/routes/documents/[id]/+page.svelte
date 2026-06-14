<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { formatBytes, formatDate } from '$lib/utils/format';
	import {
		DOCUMENT_STATUS_LABELS,
		DOCUMENT_STATUS_VARIANTS,
		DOCUMENT_VISIBILITY_LABELS,
		isDocumentStatus,
		isDocumentVisibility
	} from '$lib/types/api';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();

	const document = $derived(data.document);
	const status = $derived(isDocumentStatus(document?.status) ? document.status : 'PROCESSING');
	const visibility = $derived(
		isDocumentVisibility(document?.visibility) ? document.visibility : 'PRIVATE'
	);
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<Button href="/documents" variant="ghost" size="sm" class="mb-2">← Kembali</Button>
			<h1 class="text-2xl font-bold text-foreground">{document?.originalName ?? 'Dokumen'}</h1>
			<p class="mt-1 text-muted-foreground">Detail dan status pemrosesan dokumen.</p>
		</div>

		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				if (!confirm('Hapus dokumen ini? Tindakan tidak dapat dibatalkan.')) {
					return () => {};
				}

				toast.loading('Menghapus dokumen...');

				return async ({ result, update }) => {
					toast.dismiss();

					if (result.type === 'redirect') {
						toast.success('Dokumen berhasil dihapus');
						await update();
						return;
					}

					if (result.type === 'failure') {
						toast.error((result.data as { error?: string })?.error ?? 'Gagal menghapus dokumen');
					}
				};
			}}
		>
			<Button type="submit" variant="destructive">Hapus Dokumen</Button>
		</form>
	</div>

	<div class="rounded-xl border border-border bg-card/50 p-6 space-y-4">
		<div class="flex flex-wrap gap-2">
			<Badge variant={DOCUMENT_STATUS_VARIANTS[status]}>
				{DOCUMENT_STATUS_LABELS[status]}
			</Badge>
			<Badge variant="outline">{DOCUMENT_VISIBILITY_LABELS[visibility]}</Badge>
		</div>

		<dl class="grid gap-4 sm:grid-cols-2">
			<div>
				<dt class="text-sm text-muted-foreground">Nama file</dt>
				<dd class="font-medium">{document?.filename ?? '-'}</dd>
			</div>
			<div>
				<dt class="text-sm text-muted-foreground">Tipe</dt>
				<dd class="font-medium">{document?.mimeType ?? '-'}</dd>
			</div>
			<div>
				<dt class="text-sm text-muted-foreground">Ukuran</dt>
				<dd class="font-medium">{formatBytes(document?.fileSize ?? 0)}</dd>
			</div>
			<div>
				<dt class="text-sm text-muted-foreground">Total chunks</dt>
				<dd class="font-medium">{document?.totalChunks ?? 0}</dd>
			</div>
			<div>
				<dt class="text-sm text-muted-foreground">Diupload</dt>
				<dd class="font-medium">
					{document?.createdAt ? formatDate(document.createdAt) : '-'}
				</dd>
			</div>
			<div>
				<dt class="text-sm text-muted-foreground">ID</dt>
				<dd class="font-mono text-xs break-all">{document?.id ?? '-'}</dd>
			</div>
		</dl>

		{#if status === 'COMPLETED'}
			<Button href="/chat" class="mt-2">Tanya AI tentang dokumen ini</Button>
		{:else if status === 'PROCESSING'}
			<p class="text-sm text-muted-foreground">
				Dokumen masih diproses. Refresh halaman ini untuk memperbarui status.
			</p>
		{:else if status === 'FAILED'}
			<p class="text-sm text-destructive">
				Pemrosesan gagal. Coba upload ulang dokumen dengan format yang didukung (PDF, PNG, JPG).
			</p>
		{/if}
	</div>
</div>

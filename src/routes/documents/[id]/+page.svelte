<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { formatBytes, formatDate, formatDocumentName } from '$lib/utils/format';
	import {
		DOCUMENT_STATUS_LABELS,
		DOCUMENT_STATUS_VARIANTS,
		DOCUMENT_VISIBILITY_LABELS,
		isDocumentStatus,
		isDocumentVisibility
	} from '$lib/types/api';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateDocumentVisibilitySchema } from '$lib/zod4_schema/document';

	let { data }: { data: PageData } = $props();

	const document = $derived(data.document);
	const displayName = $derived(formatDocumentName(document?.originalName ?? document?.filename));
	const status = $derived(isDocumentStatus(document?.status) ? document.status : 'PROCESSING');
	const visibility = $derived(
		isDocumentVisibility(document?.visibility) ? document.visibility : 'PRIVATE'
	);
	const isPdf = $derived(document?.mimeType === 'application/pdf');

	const publicDescription = $derived(
		data.user?.role === 'ADMIN'
			? 'Semua pengguna dapat mengakses dokumen'
			: 'Dosen dan mahasiswa dengan jurusan yang sama dapat mengakses'
	);

	const visibilityForm = superForm(data.visibilityForm, {
		validators: zod4(updateDocumentVisibilitySchema),
		resetForm: false,
		onUpdated({ form: updatedForm }) {
			if (updatedForm.message) {
				toast.error(String(updatedForm.message));
			}
		}
	});

	const { form: visibilityFormData, enhance: visibilityEnhance, submitting: visibilitySubmitting } =
		visibilityForm;
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="min-w-0 flex-1">
			<Button href="/documents" variant="ghost" size="sm" class="mb-3 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Kembali
			</Button>

			<div class="flex items-start gap-3">
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10"
					aria-hidden="true"
				>
					{#if isPdf}
						<svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					{:else}
						<svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
					<div class="flex flex-wrap items-center gap-2">
						<h1 class="text-2xl font-bold text-foreground wrap-break-word">{displayName}</h1>
						<Badge variant={DOCUMENT_STATUS_VARIANTS[status]} class="shrink-0">
							{DOCUMENT_STATUS_LABELS[status]}
						</Badge>
					</div>
					<p class="mt-1 text-sm text-muted-foreground">Detail dan status pemrosesan dokumen.</p>
				</div>
			</div>
		</div>

		<div class="flex shrink-0 flex-wrap gap-2">
			<form
				method="POST"
				action="?/reprocess"
				use:enhance={() => {
					if (
						!confirm(
							'Proses ulang dokumen ini? Chunk dan embedding akan dibuat ulang dengan ekstraksi teks yang diperbaiki.'
						)
					) {
						return () => {};
					}

					toast.loading('Memproses ulang dokumen...');

					return async ({ result, update }) => {
						toast.dismiss();

						if (result.type === 'success') {
							toast.success('Dokumen sedang diproses ulang. Refresh halaman untuk melihat status.');
							await update();
							return;
						}

						if (result.type === 'failure') {
							toast.error(
								(result.data as { error?: string })?.error ?? 'Gagal memproses ulang dokumen'
							);
						}
					};
				}}
			>
				<Button type="submit" variant="outline">Proses Ulang</Button>
			</form>

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
	</div>

	<div class="overflow-hidden rounded-xl border border-border bg-card/50">
		{#if data.canEditVisibility}
			<div class="space-y-4 p-6">
				<form
					method="POST"
					action="?/updateVisibility"
					use:visibilityEnhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								toast.success('Visibilitas dokumen berhasil diperbarui');
								await update();
								return;
							}

							if (result.type === 'failure') {
								toast.error(
									(result.data as { error?: string })?.error ?? 'Gagal memperbarui visibilitas'
								);
							}
						};
					}}
					class="space-y-4"
				>
					<div>
						<p class="text-sm font-medium text-foreground">Visibilitas Dokumen</p>
						<p class="mt-1 text-sm text-muted-foreground">
							Ubah siapa saja yang dapat mengakses dokumen ini.
						</p>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<label
							class="relative flex cursor-pointer rounded-lg border p-4 transition-all {$visibilityFormData.visibility ===
							'PRIVATE'
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'}"
						>
							<input
								type="radio"
								name="visibility"
								value="PRIVATE"
								bind:group={$visibilityFormData.visibility}
								class="sr-only"
								disabled={$visibilitySubmitting}
							/>
							<div class="flex items-start gap-3">
								<div
									class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 {$visibilityFormData.visibility ===
									'PRIVATE'
										? 'border-primary'
										: 'border-muted-foreground'}"
								>
									{#if $visibilityFormData.visibility === 'PRIVATE'}
										<div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
									{/if}
								</div>
								<div>
									<p class="font-medium text-foreground">Privat</p>
									<p class="text-sm text-muted-foreground">Hanya Anda yang dapat mengakses</p>
								</div>
							</div>
						</label>

						<label
							class="relative flex cursor-pointer rounded-lg border p-4 transition-all {$visibilityFormData.visibility ===
							'PUBLIC'
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'}"
						>
							<input
								type="radio"
								name="visibility"
								value="PUBLIC"
								bind:group={$visibilityFormData.visibility}
								class="sr-only"
								disabled={$visibilitySubmitting}
							/>
							<div class="flex items-start gap-3">
								<div
									class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 {$visibilityFormData.visibility ===
									'PUBLIC'
										? 'border-primary'
										: 'border-muted-foreground'}"
								>
									{#if $visibilityFormData.visibility === 'PUBLIC'}
										<div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
									{/if}
								</div>
								<div>
									<p class="font-medium text-foreground">Publik</p>
									<p class="text-sm text-muted-foreground">{publicDescription}</p>
								</div>
							</div>
						</label>
					</div>

					<Button type="submit" size="sm" disabled={$visibilitySubmitting}>
						{#if $visibilitySubmitting}
							Menyimpan...
						{:else}
							Simpan Visibilitas
						{/if}
					</Button>
				</form>
			</div>
		{:else}
			<div class="flex items-center gap-2 border-b border-border px-6 py-4">
				<span
					class="inline-flex items-center gap-1.5 text-sm {visibility === 'PUBLIC'
						? 'text-green-600 dark:text-green-400'
						: 'text-muted-foreground'}"
				>
					{#if visibility === 'PUBLIC'}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					{:else}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
				{#if data.user?.role === 'STUDENT'}
					<span class="text-sm text-muted-foreground">
						— akun mahasiswa hanya dapat menggunakan dokumen privat.
					</span>
				{/if}
			</div>
		{/if}

		<div class="border-t border-border bg-muted/20 px-6 py-5">
			<h2 class="mb-4 text-sm font-medium text-foreground">Informasi Dokumen</h2>
			<dl class="grid gap-4 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<dt class="text-sm text-muted-foreground">Nama file</dt>
					<dd class="mt-0.5 font-medium text-foreground wrap-break-word">{displayName}</dd>
				</div>
				<div>
					<dt class="text-sm text-muted-foreground">Tipe</dt>
					<dd class="mt-0.5 font-medium text-foreground">{document?.mimeType ?? '-'}</dd>
				</div>
				<div>
					<dt class="text-sm text-muted-foreground">Ukuran</dt>
					<dd class="mt-0.5 font-medium text-foreground">{formatBytes(document?.fileSize ?? 0)}</dd>
				</div>
				<div>
					<dt class="text-sm text-muted-foreground">Total chunks</dt>
					<dd class="mt-0.5 font-medium text-foreground">{document?.totalChunks ?? 0}</dd>
				</div>
				<div>
					<dt class="text-sm text-muted-foreground">Diupload</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						{document?.createdAt ? formatDate(document.createdAt) : '-'}
					</dd>
				</div>
				<div>
					<dt class="text-sm text-muted-foreground">ID</dt>
					<dd class="mt-0.5 font-mono text-xs text-foreground break-all">{document?.id ?? '-'}</dd>
				</div>
			</dl>
		</div>

		<div class="border-t border-border px-6 py-4">
			{#if status === 'COMPLETED'}
				<Button
					href={`/chat?newDoc=${document?.id ?? ''}&docName=${encodeURIComponent(displayName)}`}
				>
					Tanya AI tentang dokumen ini
				</Button>
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
</div>

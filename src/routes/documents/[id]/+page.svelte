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
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { updateDocumentVisibilitySchema } from '$lib/zod4_schema/document';

	let { data }: { data: PageData } = $props();

	const document = $derived(data.document);
	const status = $derived(isDocumentStatus(document?.status) ? document.status : 'PROCESSING');
	const visibility = $derived(
		isDocumentVisibility(document?.visibility) ? document.visibility : 'PRIVATE'
	);

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

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<Button href="/documents" variant="ghost" size="sm" class="mb-2">← Kembali</Button>
			<h1 class="text-2xl font-bold text-foreground">{document?.originalName ?? 'Dokumen'}</h1>
			<p class="mt-1 text-muted-foreground">Detail dan status pemrosesan dokumen.</p>
		</div>

		<div class="flex flex-wrap gap-2">
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

	<div class="rounded-xl border border-border bg-card/50 p-6 space-y-4">
		<div class="flex flex-wrap gap-2">
			<Badge variant={DOCUMENT_STATUS_VARIANTS[status]}>
				{DOCUMENT_STATUS_LABELS[status]}
			</Badge>
			{#if !data.canEditVisibility}
				<Badge variant="outline">{DOCUMENT_VISIBILITY_LABELS[visibility]}</Badge>
			{/if}
		</div>

		{#if data.canEditVisibility}
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
				class="rounded-lg border border-border/70 bg-muted/20 p-4 space-y-4"
			>
				<div>
					<p class="text-sm font-medium text-foreground">Visibilitas Dokumen</p>
					<p class="text-sm text-muted-foreground mt-1">
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
		{:else}
			<p class="text-sm text-muted-foreground">
				Visibilitas: <span class="font-medium text-foreground">{DOCUMENT_VISIBILITY_LABELS[visibility]}</span>
				{#if data.user?.role === 'STUDENT'}
					— akun mahasiswa hanya dapat menggunakan dokumen privat.
				{/if}
			</p>
		{/if}

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
			<Button
				href={`/chat?newDoc=${document?.id ?? ''}&docName=${encodeURIComponent(
					document?.originalName ?? ''
				)}`}
				class="mt-2">Tanya AI tentang dokumen ini</Button
			>
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

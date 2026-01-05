<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { formatBytes } from '$lib/utils/format';
	import { enhance } from '$app/forms';

	let isDragging = $state(false);
	let selectedFile = $state<File | null>(null);
	let visibility = $state<'PUBLIC' | 'PRIVATE'>('PRIVATE');
	let isUploading = $state(false);
	let fileInput: HTMLInputElement;

	const acceptedTypes = '.pdf,.png,.jpg,.jpeg';
	const acceptedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			validateAndSetFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			validateAndSetFile(target.files[0]);
		}
	}

	function validateAndSetFile(file: File) {
		if (!acceptedMimes.includes(file.type)) {
			toast.error('Tipe file tidak didukung. Gunakan PDF, PNG, JPG, atau JPEG.');
			return;
		}

		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			toast.error('Ukuran file maksimal 10MB');
			return;
		}

		selectedFile = file;
	}

	function removeFile() {
		selectedFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function getFileIcon(type: string) {
		if (type === 'application/pdf') return 'pdf';
		return 'image';
	}
</script>

<div class="container mx-auto max-w-2xl py-8 px-4">
	<div class="space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-foreground">Upload Dokumen</h1>
			<p class="text-muted-foreground mt-1">
				Upload dokumen PDF atau gambar untuk diproses oleh sistem RAG.
			</p>
		</div>

		<!-- Upload Form -->
		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				isUploading = true;
				toast.loading('Mengupload dokumen...');

				return async ({ result, update }) => {
					isUploading = false;
					toast.dismiss();

					if (result.type === 'success' && result.data?.success) {
						toast.success('Dokumen berhasil diupload! Sedang diproses...');
						goto('/dashboard');
					} else if (result.type === 'failure') {
						const errorMsg = (result.data as { error?: string })?.error || 'Gagal upload dokumen';
						toast.error(errorMsg);
					} else if (result.type === 'redirect') {
						await update();
					} else {
						toast.error('Terjadi kesalahan');
					}
				};
			}}
			class="space-y-6"
		>
			<!-- Drop Zone -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="relative rounded-xl border-2 border-dashed transition-all duration-200 {isDragging
					? 'border-primary bg-primary/5'
					: selectedFile
						? 'border-primary/50 bg-primary/5'
						: 'border-border hover:border-primary/50 hover:bg-muted/50'}"
				role="button"
				tabindex="0"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
			>
				<input
					type="file"
					name="file"
					accept={acceptedTypes}
					class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onchange={handleFileSelect}
					bind:this={fileInput}
					disabled={isUploading}
				/>

				<div class="p-8 text-center">
					{#if selectedFile}
						<!-- File Selected State -->
						<div class="space-y-4">
							<div
								class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10"
							>
								{#if getFileIcon(selectedFile.type) === 'pdf'}
									<svg
										class="w-8 h-8 text-primary"
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
										class="w-8 h-8 text-primary"
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

							<div>
								<p class="font-medium text-foreground">{selectedFile.name}</p>
								<p class="text-sm text-muted-foreground">{formatBytes(selectedFile.size)}</p>
							</div>

							<button
								type="button"
								class="text-sm text-destructive hover:underline"
								onclick={removeFile}
								disabled={isUploading}
							>
								Hapus file
							</button>
						</div>
					{:else}
						<!-- Empty State -->
						<div class="space-y-4">
							<div
								class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted {isDragging
									? 'bg-primary/10'
									: ''}"
							>
								<svg
									class="w-8 h-8 text-muted-foreground {isDragging ? 'text-primary' : ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
							</div>

							<div>
								<p class="font-medium text-foreground">
									{isDragging ? 'Lepaskan file di sini' : 'Drag & drop file di sini'}
								</p>
								<p class="text-sm text-muted-foreground mt-1">atau klik untuk browse</p>
							</div>

							<p class="text-xs text-muted-foreground">PDF, PNG, JPG, JPEG (Maks. 10MB)</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Visibility Selection -->
			<fieldset class="space-y-3">
				<legend class="text-sm font-medium text-foreground">Visibility</legend>
				<div class="grid gap-3 sm:grid-cols-2">
					<label
						class="relative flex cursor-pointer rounded-lg border p-4 transition-all {visibility ===
						'PRIVATE'
							? 'border-primary bg-primary/5'
							: 'border-border hover:border-primary/50'}"
					>
						<input
							type="radio"
							name="visibility"
							value="PRIVATE"
							bind:group={visibility}
							class="sr-only"
						/>
						<div class="flex items-start gap-3">
							<div
								class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 {visibility ===
								'PRIVATE'
									? 'border-primary'
									: 'border-muted-foreground'}"
							>
								{#if visibility === 'PRIVATE'}
									<div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
								{/if}
							</div>
							<div>
								<p class="font-medium text-foreground">Private</p>
								<p class="text-sm text-muted-foreground">Hanya Anda yang dapat mengakses dokumen</p>
							</div>
						</div>
					</label>

					<label
						class="relative flex cursor-pointer rounded-lg border p-4 transition-all {visibility ===
						'PUBLIC'
							? 'border-primary bg-primary/5'
							: 'border-border hover:border-primary/50'}"
					>
						<input
							type="radio"
							name="visibility"
							value="PUBLIC"
							bind:group={visibility}
							class="sr-only"
						/>
						<div class="flex items-start gap-3">
							<div
								class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 {visibility ===
								'PUBLIC'
									? 'border-primary'
									: 'border-muted-foreground'}"
							>
								{#if visibility === 'PUBLIC'}
									<div class="h-2.5 w-2.5 rounded-full bg-primary"></div>
								{/if}
							</div>
							<div>
								<p class="font-medium text-foreground">Public</p>
								<p class="text-sm text-muted-foreground">Semua pengguna dapat melihat dokumen</p>
							</div>
						</div>
					</label>
				</div>
			</fieldset>

			<!-- Actions -->
			<div class="flex items-center gap-3 pt-2">
				<Button type="submit" disabled={!selectedFile || isUploading} class="flex-1 sm:flex-none">
					{#if isUploading}
						<svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Mengupload...
					{:else}
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							/>
						</svg>
						Upload Dokumen
					{/if}
				</Button>
				<Button href="/dashboard" variant="outline" disabled={isUploading}>Batal</Button>
			</div>
		</form>
	</div>
</div>

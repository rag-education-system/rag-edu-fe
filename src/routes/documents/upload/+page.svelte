<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { formatBytes } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const userRole = $derived(data.user?.role ?? 'STUDENT');
	const canChoosePublic = $derived(userRole === 'ADMIN' || userRole === 'TEACHER');
	const publicDescription = $derived(
		userRole === 'ADMIN'
			? 'Semua pengguna dapat mengakses dokumen'
			: 'Dosen dan mahasiswa dengan jurusan yang sama dapat mengakses'
	);

	let isDragging = $state(false);
	let selectedFile = $state<File | null>(null);
	let visibility = $state<'PUBLIC' | 'PRIVATE'>('PRIVATE');
	let isUploading = $state(false);
	let fileInput: HTMLInputElement;

	let uploadProgress = $state(0);
	let uploadPhase = $state<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
	let processingStatus = $state('');
	let documentId = $state<string | null>(null);

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
		uploadPhase = 'idle';
		uploadProgress = 0;
	}

	function removeFile() {
		selectedFile = null;
		uploadPhase = 'idle';
		uploadProgress = 0;
		documentId = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function getFileIcon(type: string) {
		if (type === 'application/pdf') return 'pdf';
		return 'image';
	}

	async function handleUpload(e: Event) {
		e.preventDefault();

		if (!selectedFile) {
			toast.error('Pilih file terlebih dahulu');
			return;
		}

		isUploading = true;
		uploadPhase = 'uploading';
		uploadProgress = 0;

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('visibility', canChoosePublic ? visibility : 'PRIVATE');

			const response = await uploadWithProgress(formData);

			if (response.id) {
				documentId = response.id;
				uploadPhase = 'processing';
				processingStatus = 'Memproses dokumen...';

				await pollDocumentStatus(response.id);
			}
		} catch (error) {
			uploadPhase = 'error';
			toast.error(error instanceof Error ? error.message : 'Gagal upload dokumen');
			isUploading = false;
		}
	}

	function uploadWithProgress(formData: FormData): Promise<{ id: string; status: string }> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const uploadUrl = `${data.upload.apiUrl}/api/documents/upload`;
			const timeoutMs = 3 * 60 * 1000;

			xhr.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					uploadProgress = Math.round((e.loaded / e.total) * 100);
				}
			});

			xhr.addEventListener('load', () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const response = JSON.parse(xhr.responseText);
						resolve(response);
					} catch {
						reject(new Error('Respons server tidak valid'));
					}
				} else if (xhr.status === 401) {
					reject(new Error('Sesi berakhir. Silakan login kembali.'));
				} else if (xhr.status === 429) {
					reject(new Error('Terlalu banyak upload. Tunggu sebentar lalu coba lagi.'));
				} else {
					try {
						const error = JSON.parse(xhr.responseText);
						reject(new Error(error.error || 'Upload gagal'));
					} catch {
						reject(new Error(`Upload gagal (HTTP ${xhr.status})`));
					}
				}
			});

			xhr.addEventListener('error', () => {
				reject(
					new Error(
						'Gagal terhubung ke server. Pastikan backend aktif dan CORS dikonfigurasi untuk domain frontend.'
					)
				);
			});

			xhr.addEventListener('timeout', () => {
				reject(new Error('Upload timeout. File terlalu besar atau koneksi lambat.'));
			});

			xhr.open('POST', uploadUrl);
			xhr.setRequestHeader('Authorization', `Bearer ${data.upload.token}`);
			xhr.timeout = timeoutMs;
			xhr.send(formData);
		});
	}

	async function pollDocumentStatus(docId: string) {
		const maxAttempts = 60;
		let attempts = 0;

		const checkStatus = async (): Promise<void> => {
			attempts++;

			try {
				const response = await fetch(`/api/documents/${docId}`);

				if (!response.ok) {
					throw new Error('Gagal memeriksa status');
				}

				const result = await response.json();
				const doc = result.data || result;

				if (doc.status === 'COMPLETED') {
					uploadPhase = 'completed';
					processingStatus = `Selesai! ${doc.totalChunks || 0} chunk berhasil dibuat.`;
					toast.success('Dokumen berhasil diproses!');
					isUploading = false;

					setTimeout(() => {
						goto('/dashboard');
					}, 1500);
					return;
				}

				if (doc.status === 'FAILED') {
					uploadPhase = 'error';
					processingStatus = 'Gagal memproses dokumen';
					toast.error('Gagal memproses dokumen');
					isUploading = false;
					return;
				}

				if (doc.totalChunks && doc.totalChunks > 0) {
					processingStatus = `Memproses... ${doc.totalChunks} chunk`;
				}

				if (attempts < maxAttempts) {
					setTimeout(checkStatus, 2000);
				} else {
					processingStatus = 'Proses masih berjalan di background...';
					toast.info('Proses berjalan di background. Cek dashboard untuk status.');
					isUploading = false;
					setTimeout(() => goto('/dashboard'), 2000);
				}
			} catch {
				if (attempts < maxAttempts) {
					setTimeout(checkStatus, 2000);
				} else {
					uploadPhase = 'error';
					toast.error('Gagal memeriksa status dokumen');
					isUploading = false;
				}
			}
		};

		await checkStatus();
	}

	function getProgressBarColor() {
		switch (uploadPhase) {
			case 'uploading':
				return 'bg-blue-500';
			case 'processing':
				return 'bg-yellow-500';
			case 'completed':
				return 'bg-green-500';
			case 'error':
				return 'bg-red-500';
			default:
				return 'bg-primary';
		}
	}

	function getPhaseText() {
		switch (uploadPhase) {
			case 'uploading':
				return `Mengupload... ${uploadProgress}%`;
			case 'processing':
				return processingStatus;
			case 'completed':
				return processingStatus;
			case 'error':
				return 'Terjadi kesalahan';
			default:
				return '';
		}
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
		<form onsubmit={handleUpload} class="space-y-6">
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

			<!-- Progress Bar -->
			{#if uploadPhase !== 'idle'}
				<div class="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-foreground">{getPhaseText()}</span>
						{#if uploadPhase === 'uploading'}
							<span class="text-muted-foreground">{uploadProgress}%</span>
						{/if}
					</div>

					<div class="h-2 w-full bg-muted rounded-full overflow-hidden">
						{#if uploadPhase === 'uploading'}
							<div
								class="h-full transition-all duration-300 ease-out {getProgressBarColor()}"
								style="width: {uploadProgress}%"
							></div>
						{:else if uploadPhase === 'processing'}
							<div class="h-full w-full {getProgressBarColor()} animate-pulse"></div>
						{:else if uploadPhase === 'completed'}
							<div class="h-full w-full {getProgressBarColor()}"></div>
						{:else if uploadPhase === 'error'}
							<div class="h-full w-full {getProgressBarColor()}"></div>
						{/if}
					</div>

					<!-- Phase Steps -->
					<div class="flex items-center justify-between text-xs text-muted-foreground pt-1">
						<div class="flex items-center gap-1.5">
							<div
								class="w-2 h-2 rounded-full {uploadPhase === 'uploading' ||
								uploadPhase === 'processing' ||
								uploadPhase === 'completed'
									? 'bg-blue-500'
									: 'bg-muted-foreground/30'}"
							></div>
							<span>Upload</span>
						</div>
						<div class="flex-1 h-px bg-border mx-2"></div>
						<div class="flex items-center gap-1.5">
							<div
								class="w-2 h-2 rounded-full {uploadPhase === 'processing' ||
								uploadPhase === 'completed'
									? 'bg-yellow-500'
									: 'bg-muted-foreground/30'}"
							></div>
							<span>Proses</span>
						</div>
						<div class="flex-1 h-px bg-border mx-2"></div>
						<div class="flex items-center gap-1.5">
							<div
								class="w-2 h-2 rounded-full {uploadPhase === 'completed'
									? 'bg-green-500'
									: 'bg-muted-foreground/30'}"
							></div>
							<span>Selesai</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Visibility Selection -->
			{#if canChoosePublic}
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
									<p class="text-sm text-muted-foreground">{publicDescription}</p>
								</div>
							</div>
						</label>
					</div>
				</fieldset>
			{:else}
				<input type="hidden" name="visibility" value="PRIVATE" />
				<p class="text-sm text-muted-foreground">
					Dokumen mahasiswa bersifat private dan hanya dapat diakses oleh Anda.
				</p>
			{/if}

				<!-- Actions -->
			<div class="flex items-center gap-3 pt-2">
				<Button
					type="submit"
					disabled={!selectedFile || isUploading || uploadPhase === 'completed'}
					class="flex-1 sm:flex-none"
				>
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
						{uploadPhase === 'uploading' ? 'Mengupload...' : 'Memproses...'}
					{:else if uploadPhase === 'completed'}
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Selesai
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

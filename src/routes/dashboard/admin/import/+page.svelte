<script module lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import type { DtoBulkImportUsersResponse } from '$lib/api/api';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let selectedFile = $state<File | null>(null);
	let submitting = $state(false);

	const inputClass =
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-ring/50 transition-colors file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-medium';

	const result = $derived(form?.result as DtoBulkImportUsersResponse | undefined);

	const copyPassword = async (password?: string) => {
		if (!password) return;
		try {
			await navigator.clipboard.writeText(password);
			toast.success('Password berhasil disalin');
		} catch {
			toast.error('Gagal menyalin password');
		}
	};
</script>

<svelte:head>
	<title>Import Akun - Admin</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-6">
	<Card class="overflow-hidden border-border/80 bg-card/80 shadow-sm">
		<CardHeader class="border-b border-border/60 bg-muted/20 pb-6">
			<CardTitle class="text-xl">Import Akun dari File</CardTitle>
			<CardDescription>
				Upload file CSV atau Excel (.xlsx) untuk membuat banyak akun sekaligus.
			</CardDescription>
		</CardHeader>

		<CardContent class="space-y-6 pt-6">
			<div class="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm">
				<p class="font-medium">Format kolom wajib:</p>
				<ul class="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
					<li><strong>nama</strong> — nama lengkap pengguna</li>
					<li><strong>email</strong> — email kampus</li>
					<li><strong>jurusan</strong> — program studi (contoh: PTIK)</li>
					<li><strong>peran</strong> — STUDENT, TEACHER, MAHASISWA, atau DOSEN</li>
					<li><strong>password</strong> — opsional, kosongkan untuk password otomatis</li>
				</ul>
			</div>

			<div class="flex flex-wrap gap-2">
				<Button
					href="/dashboard/admin/import/template"
					variant="outline"
					data-sveltekit-reload
				>
					Unduh Template CSV
				</Button>
				<Button href="/dashboard/admin/create" variant="ghost">Buat Satu Akun</Button>
			</div>

			{#if form?.error}
				<div class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					submitting = true;
					return async ({ update, result }) => {
						await update();
						submitting = false;
						if (result.type === 'success') {
							toast.success('Import selesai diproses');
						} else if (result.type === 'failure') {
							toast.error('Import gagal');
						}
					};
				}}
			>
				<div class="space-y-4">
					<div>
						<label for="file" class="mb-2 block text-sm font-medium">File CSV / Excel</label>
						<input
							id="file"
							name="file"
							type="file"
							accept=".csv,.xlsx,.xlsm,.xltx,.xltm"
							class={inputClass}
							disabled={submitting}
							onchange={(event) => {
								selectedFile = event.currentTarget.files?.[0] ?? null;
							}}
						/>
						<p class="mt-2 text-xs text-muted-foreground">
							Maksimal 500 baris dan 5MB per file. Mendukung CSV dan XLSX.
						</p>
					</div>

					<Button type="submit" disabled={submitting || !selectedFile}>
						{#if submitting}
							Mengimport...
						{:else}
							Import Akun
						{/if}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>

	{#if result}
		<Card>
			<CardHeader>
				<CardTitle class="text-lg">Hasil Import</CardTitle>
				<CardDescription>{result.message}</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex flex-wrap gap-3">
					<Badge variant="secondary">Total: {result.total ?? 0}</Badge>
					<Badge class="bg-green-600 hover:bg-green-600">Berhasil: {result.success ?? 0}</Badge>
					{#if (result.failed ?? 0) > 0}
						<Badge variant="destructive">Gagal: {result.failed}</Badge>
					{/if}
				</div>

				<div class="overflow-x-auto rounded-lg border border-border">
					<table class="w-full text-sm">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left font-medium">Baris</th>
								<th class="px-4 py-3 text-left font-medium">Nama</th>
								<th class="px-4 py-3 text-left font-medium">Email</th>
								<th class="px-4 py-3 text-left font-medium">Status</th>
								<th class="px-4 py-3 text-left font-medium">Password</th>
							</tr>
						</thead>
						<tbody>
							{#each result.results ?? [] as item (item.row)}
								<tr class="border-t border-border">
									<td class="px-4 py-3">{item.row}</td>
									<td class="px-4 py-3">{item.name || '—'}</td>
									<td class="px-4 py-3 text-muted-foreground">{item.email || '—'}</td>
									<td class="px-4 py-3">
										{#if item.success}
											<Badge class="bg-green-600 hover:bg-green-600">Berhasil</Badge>
										{:else}
											<span class="text-destructive">{item.error}</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										{#if item.success && item.password}
											<div class="flex items-center gap-2">
												<code class="rounded bg-muted px-2 py-1 text-xs">{item.password}</code>
												<button
													type="button"
													class="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
													title="Salin password"
													aria-label="Salin password"
													onclick={() => copyPassword(item.password)}
												>
													<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
														/>
													</svg>
												</button>
											</div>
										{:else}
											<span class="text-muted-foreground">—</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</CardContent>
			<CardFooter>
				<Button href="/dashboard/admin">Lihat Daftar Pengguna</Button>
			</CardFooter>
		</Card>
	{/if}
</div>

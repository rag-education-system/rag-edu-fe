<script module lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors,
		FormDescription
	} from '$lib/components/ui/form';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
</script>

<script lang="ts">
	import { updateUserSchema } from '$lib/zod4_schema/user';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const inputClass =
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

	const roleOptions = [
		{ value: 'STUDENT' as const, label: 'Mahasiswa' },
		{ value: 'TEACHER' as const, label: 'Dosen' }
	];

	const form = superForm(data.form, {
		validators: zod4(updateUserSchema),
		invalidateAll: true,
		onUpdated({ form: updatedForm }) {
			if (updatedForm.message) {
				const payload = updatedForm.message as { error?: boolean; message?: string };
				if (payload.error) {
					toast.error(payload.message ?? 'Gagal memperbarui akun');
				}
			}
		},
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance, message, submitting } = form;

	let showPassword = $state(false);
</script>

<svelte:head>
	<title>Edit Akun - Admin</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<Card class="overflow-hidden border-border/80 bg-card/80 shadow-sm">
		<CardHeader class="border-b border-border/60 bg-muted/20 pb-6">
			<CardTitle class="text-xl">Edit Akun Pengguna</CardTitle>
			<CardDescription>
				Perbarui data {data.user.name}. Kosongkan password jika tidak ingin mengubahnya.
			</CardDescription>
		</CardHeader>

		{#if $message}
			<div class="px-6 pt-6">
				<div
					class={cn(
						'rounded-lg border px-4 py-3 text-sm',
						typeof $message === 'object' && $message.error
							? 'border-destructive/30 bg-destructive/10 text-destructive'
							: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
					)}
				>
					{typeof $message === 'object' ? $message.message : $message}
				</div>
			</div>
		{/if}

		<form method="POST" use:enhance>
			<CardContent class="space-y-6 pt-6">
				<FormField {form} name="role">
					{#snippet children()}
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Peran</FormLabel>
								<select
									{...props}
									bind:value={$formData.role}
									class={inputClass}
									disabled={$submitting}
								>
									{#each roleOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<FormField {form} name="isActive">
					{#snippet children()}
						<FormControl>
							{#snippet children({ props })}
								<label class="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
									<input
										type="checkbox"
										{...props}
										bind:checked={$formData.isActive}
										class="h-4 w-4 rounded border-input"
										disabled={$submitting}
									/>
									<span>
										<span class="block text-sm font-medium">Akun Aktif</span>
										<span class="block text-sm text-muted-foreground">
											Nonaktifkan untuk mencegah pengguna login ke sistem.
										</span>
									</span>
								</label>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<div class="grid gap-4 sm:grid-cols-2">
					<FormField {form} name="name">
						{#snippet children()}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Nama Lengkap</FormLabel>
									<input
										type="text"
										{...props}
										bind:value={$formData.name}
										class={inputClass}
										disabled={$submitting}
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>

					<FormField {form} name="email">
						{#snippet children()}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Email Kampus</FormLabel>
									<input
										type="email"
										{...props}
										bind:value={$formData.email}
										class={inputClass}
										disabled={$submitting}
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>

					<FormField {form} name="major">
						{#snippet children()}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Jurusan / Program Studi</FormLabel>
									<input
										type="text"
										{...props}
										bind:value={$formData.major}
										class={inputClass}
										disabled={$submitting}
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>

					<FormField {form} name="password">
						{#snippet children()}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Password Baru (opsional)</FormLabel>
									<div class="relative">
										<input
											type={showPassword ? 'text' : 'password'}
											{...props}
											bind:value={$formData.password}
											placeholder="Kosongkan jika tidak diubah"
											class={cn(inputClass, 'pr-10')}
											disabled={$submitting}
										/>
										<button
											type="button"
											class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
											onclick={() => (showPassword = !showPassword)}
											aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
										>
											{#if showPassword}
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 3.029a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
												</svg>
											{:else}
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											{/if}
										</button>
									</div>
								{/snippet}
							</FormControl>
							<FormDescription>
								Password saat ini: {data.user.initialPassword || '—'}
							</FormDescription>
							<FormFieldErrors />
						{/snippet}
					</FormField>
				</div>
			</CardContent>

			<CardFooter class="flex flex-col gap-3 border-t border-border/60 bg-muted/10 sm:flex-row sm:justify-end">
				<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<Button href="/dashboard/admin" variant="outline" class="sm:min-w-[120px]">
						Batal
					</Button>
					<Button type="submit" class="sm:min-w-[140px]" disabled={$submitting}>
						{#if $submitting}
							Menyimpan...
						{:else}
							Simpan Perubahan
						{/if}
					</Button>
				</div>
			</CardFooter>
		</form>
	</Card>
</div>

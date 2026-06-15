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
	import { createUserSchema } from '$lib/zod4_schema/user';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const inputClass =
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

	const roleOptions = [
		{
			value: 'STUDENT' as const,
			label: 'Mahasiswa',
			description: 'Akses upload dokumen, chat AI, dan dashboard pribadi.',
			icon: 'student'
		},
		{
			value: 'TEACHER' as const,
			label: 'Dosen',
			description: 'Kelola materi pembelajaran dan pantau dokumen mahasiswa.',
			icon: 'teacher'
		}
	];

	const form = superForm(data.form, {
		validators: zod4(createUserSchema),
		validationMethod: 'onsubmit',
		resetForm: true,
		invalidateAll: true,
		onUpdated({ form: updatedForm }) {
			if (updatedForm.message) {
				const payload = updatedForm.message as {
					error?: boolean;
					message?: string;
					email?: string;
					password?: string;
				};
				if (payload.error) {
					createdAccount = null;
					toast.error(payload.message ?? 'Gagal membuat akun');
				} else {
					createdAccount =
						payload.email && payload.password
							? { email: payload.email, password: payload.password }
							: null;
					toast.success(payload.message ?? 'Akun berhasil dibuat');
				}
			}
		},
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance, message, submitting } = form;

	let showPassword = $state(false);
	let createdAccount = $state<{ email: string; password: string } | null>(null);

	const copyPassword = async (password: string) => {
		try {
			await navigator.clipboard.writeText(password);
			toast.success('Password berhasil disalin');
		} catch {
			toast.error('Gagal menyalin password');
		}
	};
</script>

<svelte:head>
	<title>Buat Akun - Admin</title>
</svelte:head>

{#snippet StudentIcon()}
	<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
		/>
	</svg>
{/snippet}

{#snippet TeacherIcon()}
	<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
		/>
	</svg>
{/snippet}

<div class="mx-auto max-w-3xl">
	<Card class="overflow-hidden border-border/80 bg-card/80 shadow-sm">
		<CardHeader class="border-b border-border/60 bg-muted/20 pb-6">
			<CardTitle class="text-xl">Buat Akun Baru</CardTitle>
			<CardDescription>
				Lengkapi data berikut untuk mendaftarkan mahasiswa atau dosen ke sistem RAG Education.
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

		{#if createdAccount}
			<div class="mx-6 mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
				<p class="text-sm font-medium text-foreground">Password akun baru</p>
				<p class="mt-1 text-xs text-muted-foreground">
					Simpan dan bagikan ke {createdAccount.email}. Password juga tersedia di daftar pengguna.
				</p>
				<div class="mt-3 flex flex-wrap items-center gap-2">
					<code class="rounded bg-muted px-2 py-1 text-sm">{createdAccount.password}</code>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={() => createdAccount && copyPassword(createdAccount.password)}
					>
						Salin Password
					</Button>
					<Button href="/dashboard/admin" variant="secondary" size="sm" data-sveltekit-preload-data="hover">
						Lihat Daftar Pengguna
					</Button>
				</div>
			</div>
		{/if}

		<form method="POST" use:enhance>
			<CardContent class="space-y-8 pt-6">
				<fieldset class="space-y-4">
					<legend class="text-sm font-semibold text-foreground">1. Pilih Peran</legend>

					<FormField {form} name="role">
						{#snippet children()}
							<FormControl>
								{#snippet children({ props })}
									<div class="grid gap-3 sm:grid-cols-2">
										{#each roleOptions as option}
											<button
												type="button"
												disabled={$submitting}
												onclick={() => ($formData.role = option.value)}
												class={cn(
													'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors duration-150',
													'hover:border-primary/50 hover:bg-primary/5',
													$formData.role === option.value
														? 'border-primary bg-primary/10 ring-2 ring-primary/20'
														: 'border-border bg-background'
												)}
											>
												<div
													class={cn(
														'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
														$formData.role === option.value
															? 'bg-primary text-primary-foreground'
															: 'bg-muted text-muted-foreground'
													)}
												>
													{#if option.icon === 'student'}
														{@render StudentIcon()}
													{:else}
														{@render TeacherIcon()}
													{/if}
												</div>
												<div class="min-w-0 space-y-1">
													<p class="font-medium text-foreground">{option.label}</p>
													<p class="text-xs leading-relaxed text-muted-foreground">
														{option.description}
													</p>
												</div>
											</button>
										{/each}
									</div>
									<input type="hidden" {...props} bind:value={$formData.role} />
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>
				</fieldset>

				<fieldset class="space-y-4">
					<legend class="text-sm font-semibold text-foreground">2. Informasi Akun</legend>

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
											placeholder="Contoh: Budi Santoso"
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
											placeholder="nama@univ.ac.id"
											class={inputClass}
											disabled={$submitting}
										/>
									{/snippet}
								</FormControl>
								<FormDescription>Gunakan email resmi kampus.</FormDescription>
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
											placeholder="Contoh: PTIK, TI, SI"
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
										<FormLabel>Password Awal</FormLabel>
										<div class="relative">
											<input
												type={showPassword ? 'text' : 'password'}
												{...props}
												bind:value={$formData.password}
												placeholder="Minimal 5 karakter"
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
								<FormDescription>Bagikan password ini kepada pengguna baru.</FormDescription>
								<FormFieldErrors />
							{/snippet}
						</FormField>
					</div>
				</fieldset>
			</CardContent>

			<CardFooter class="flex flex-col gap-3 border-t border-border/60 bg-muted/10 sm:flex-row sm:justify-between">
				<p class="text-xs text-muted-foreground">
					Akun langsung aktif setelah dibuat. Pengguna dapat login dengan email dan password di atas.
				</p>
				<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<Button href="/dashboard/admin" variant="outline" class="sm:min-w-[120px]" data-sveltekit-preload-data="hover">
						Batal
					</Button>
					<Button type="submit" class="sm:min-w-[140px]" disabled={$submitting}>
						{#if $submitting}
							Membuat...
						{:else}
							Buat Akun
						{/if}
					</Button>
				</div>
			</CardFooter>
		</form>
	</Card>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors
	} from '$lib/components/ui/form';
	import { updateProfileSchema } from '$lib/zod4_schema/profile';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { formatDate } from '$lib/utils/format';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4(updateProfileSchema),
		onSubmit() {
			toast.loading('Menyimpan perubahan...');
		},
		onError({ result }) {
			toast.error('Terjadi kesalahan: ' + JSON.stringify(result.error));
		},
		async onUpdated({ form }) {
			if (form.message) {
				if (form.message.error) {
					toast.error(form.message.message || 'Gagal memperbarui profil');
				} else {
					toast.success(form.message.message || 'Profil berhasil diperbarui');
					// Invalidate all data to refresh user info from server
					await invalidateAll();
				}
			}
		},
		dataType: 'json',
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance, message } = form;

	// Get initials from user name
	const initials = $derived(
		(data.user?.name || 'User')
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U'
	);

	// Role badge variant
	const roleBadgeVariant = $derived(() => {
		switch (data.user?.role) {
			case 'ADMIN':
				return 'destructive';
			case 'TEACHER':
				return 'secondary';
			default:
				return 'outline';
		}
	});

	// Role display name
	const roleDisplayName = $derived(() => {
		switch (data.user?.role) {
			case 'ADMIN':
				return 'Administrator';
			case 'TEACHER':
				return 'Dosen';
			default:
				return 'Mahasiswa';
		}
	});
</script>

<div class="space-y-8">
	<!-- Page Header -->
	<div>
		<h1 class="text-2xl font-bold text-foreground">Profil Saya</h1>
		<p class="text-muted-foreground mt-1">Kelola informasi akun dan data pribadi Anda.</p>
	</div>

	{#if data.error}
		<div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
			<p class="font-medium text-destructive">Error memuat profil</p>
			<p class="text-sm text-destructive/80 mt-1">{data.error}</p>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- User Info Card -->
		<div class="lg:col-span-1">
			<div class="rounded-xl border border-border bg-card p-6">
				<div class="flex flex-col items-center text-center">
					<!-- Avatar -->
					<div
						class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
					>
						<span class="text-3xl font-bold text-primary">{initials}</span>
					</div>

					<!-- Name & Email -->
					<h2 class="text-xl font-semibold text-foreground">{data.user?.name || 'User'}</h2>
					<p class="text-sm text-muted-foreground">{data.user?.email || '-'}</p>

					<!-- Role Badge -->
					<div class="mt-3">
						<Badge variant={roleBadgeVariant()}>{roleDisplayName()}</Badge>
					</div>

					<!-- Member Since -->
					<div class="mt-6 pt-6 border-t border-border w-full">
						<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span>Bergabung {data.user?.createdAt ? formatDate(data.user.createdAt) : '-'}</span>
						</div>
					</div>

					<!-- Major -->
					<div class="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						<span>Jurusan: {data.user?.major || '-'}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Form Card -->
		<div class="lg:col-span-2">
			<div class="rounded-xl border border-border bg-card p-6">
				<h3 class="text-lg font-semibold text-foreground mb-6">Edit Profil</h3>

				{#if $message}
					<div
						class="mb-6 rounded-md p-3 text-sm {$message.error
							? 'bg-destructive/10 text-destructive'
							: 'bg-green-500/10 text-green-600'}"
					>
						{#if typeof $message === 'object'}
							<p>{$message.message || JSON.stringify($message)}</p>
						{:else}
							<p>{$message}</p>
						{/if}
					</div>
				{/if}

				<form method="POST" use:enhance class="space-y-5">
					<FormField {form} name="name">
						{#snippet children({ constraints, errors, tainted, value })}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Nama Lengkap</FormLabel>
									<input
										type="text"
										{...props}
										bind:value={$formData.name}
										placeholder="John Doe"
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>

					<FormField {form} name="email">
						{#snippet children({ constraints, errors, tainted, value })}
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Email</FormLabel>
									<input
										type="email"
										{...props}
										bind:value={$formData.email}
										placeholder="user@example.com"
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						{/snippet}
					</FormField>



					<div class="pt-4">
						<Button type="submit" class="w-full sm:w-auto">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Simpan Perubahan
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

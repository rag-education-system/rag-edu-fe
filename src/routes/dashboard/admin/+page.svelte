<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors
	} from '$lib/components/ui/form';
	import { createUserSchema } from '$lib/zod4_schema/user';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4(createUserSchema),
		resetForm: true,
		invalidateAll: true,
		onUpdated({ form: updatedForm }) {
			if (updatedForm.message) {
				const payload = updatedForm.message as { error?: boolean; message?: string };
				if (payload.error) {
					toast.error(payload.message ?? 'Gagal membuat akun');
				} else {
					toast.success(payload.message ?? 'Akun berhasil dibuat');
				}
			}
		},
		dataType: 'json',
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance } = form;

	const roleLabel = (role?: string) => {
		switch (role) {
			case 'TEACHER':
				return 'Dosen';
			case 'ADMIN':
				return 'Admin';
			default:
				return 'Mahasiswa';
		}
	};

	const roleVariant = (role?: string) => {
		switch (role) {
			case 'TEACHER':
				return 'secondary' as const;
			case 'ADMIN':
				return 'destructive' as const;
			default:
				return 'default' as const;
		}
	};
</script>

<svelte:head>
	<title>Kelola Pengguna - Admin</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-8">
	<div>
		<h1 class="text-3xl font-bold">Kelola Pengguna</h1>
		<p class="text-muted-foreground mt-1">
			Buat akun mahasiswa dan dosen. Pendaftaran mandiri dinonaktifkan.
		</p>
	</div>

	{#if data.error}
		<div class="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
			{data.error}
		</div>
	{/if}

	<div class="grid gap-8 lg:grid-cols-[380px_1fr]">
		<section class="rounded-lg border border-border p-6 space-y-4">
			<div>
				<h2 class="text-lg font-semibold">Buat Akun Baru</h2>
				<p class="text-sm text-muted-foreground">Hanya admin yang dapat membuat akun.</p>
			</div>

			<form method="POST" action="?/create" use:enhance class="space-y-4">
				<FormField {form} name="role">
					{#snippet children()}
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Peran</FormLabel>
								<select
									{...props}
									bind:value={$formData.role}
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors focus:ring-[3px]"
								>
									<option value="STUDENT">Mahasiswa</option>
									<option value="TEACHER">Dosen</option>
								</select>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<FormField {form} name="name">
					{#snippet children()}
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Nama Lengkap</FormLabel>
								<input
									type="text"
									{...props}
									bind:value={$formData.name}
									placeholder="Nama lengkap"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors focus:ring-[3px]"
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
								<FormLabel>Email</FormLabel>
								<input
									type="email"
									{...props}
									bind:value={$formData.email}
									placeholder="user@univ.ac.id"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors focus:ring-[3px]"
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
								<FormLabel>Jurusan</FormLabel>
								<input
									type="text"
									{...props}
									bind:value={$formData.major}
									placeholder="ptik, ti, si"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors focus:ring-[3px]"
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
								<FormLabel>Password</FormLabel>
								<input
									type="password"
									{...props}
									bind:value={$formData.password}
									placeholder="••••••••"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors focus:ring-[3px]"
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<Button type="submit" class="w-full">Buat Akun</Button>
			</form>
		</section>

		<section class="rounded-lg border border-border overflow-hidden">
			<div class="border-b border-border px-6 py-4">
				<h2 class="text-lg font-semibold">Daftar Pengguna</h2>
				<p class="text-sm text-muted-foreground">{data.users.length} pengguna terdaftar</p>
			</div>

			{#if data.users.length === 0}
				<div class="p-8 text-center text-muted-foreground">Belum ada pengguna.</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left font-medium">Nama</th>
								<th class="px-4 py-3 text-left font-medium">Email</th>
								<th class="px-4 py-3 text-left font-medium">Jurusan</th>
								<th class="px-4 py-3 text-left font-medium">Peran</th>
							</tr>
						</thead>
						<tbody>
							{#each data.users as user (user.id)}
								<tr class="border-t border-border">
									<td class="px-4 py-3">{user.name}</td>
									<td class="px-4 py-3 text-muted-foreground">{user.email}</td>
									<td class="px-4 py-3">{user.major}</td>
									<td class="px-4 py-3">
										<Badge variant={roleVariant(user.role)}>{roleLabel(user.role)}</Badge>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>
	</div>
</div>

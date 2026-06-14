<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const inputClass =
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus-visible:ring-[3px]';

	const roleOptions = [
		{ value: '', label: 'Semua Peran' },
		{ value: 'STUDENT', label: 'Mahasiswa' },
		{ value: 'TEACHER', label: 'Dosen' },
		{ value: 'ADMIN', label: 'Admin' }
	] as const;

	let searchQuery = $state(data.filters.q);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		searchQuery = data.filters.q;
	});

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

	const hasActiveFilters = $derived(
		Boolean(data.filters.q || data.filters.role || data.filters.major)
	);

	const meta = $derived({
		total: data.meta?.total ?? 0,
		page: data.meta?.page ?? 1,
		limit: data.meta?.limit ?? 10,
		totalPages: data.meta?.totalPages ?? 0
	});

	const resultLabel = $derived(
		hasActiveFilters
			? `${meta.total} pengguna cocok dengan filter`
			: `${data.allUsersCount} pengguna terdaftar`
	);

	function updateUrl(params: { q?: string; role?: string; major?: string; page?: number }) {
		const url = new URL($page.url);

		if (params.q !== undefined) {
			if (params.q.trim()) url.searchParams.set('q', params.q.trim());
			else url.searchParams.delete('q');
		}

		if (params.role !== undefined) {
			if (params.role) url.searchParams.set('role', params.role);
			else url.searchParams.delete('role');
		}

		if (params.major !== undefined) {
			if (params.major) url.searchParams.set('major', params.major);
			else url.searchParams.delete('major');
		}

		if (params.page !== undefined) {
			if (params.page > 1) url.searchParams.set('page', params.page.toString());
			else url.searchParams.delete('page');
		}

		goto(url.toString(), { keepFocus: true, noScroll: true, invalidateAll: false });
	}

	function updateFilters(params: { q?: string; role?: string; major?: string }) {
		updateUrl({ ...params, page: 1 });
	}

	function handleSearchInput(value: string) {
		searchQuery = value;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => updateFilters({ q: value }), 300);
	}

	function handlePageChange(newPage: number) {
		updateUrl({ page: newPage });
	}

	function clearFilters() {
		searchQuery = '';
		goto('/dashboard/admin', { keepFocus: true, noScroll: true, invalidateAll: false });
	}

	const copyPassword = async (password?: string) => {
		if (!password) {
			toast.error('Password tidak tersedia untuk akun ini');
			return;
		}

		try {
			await navigator.clipboard.writeText(password);
			toast.success('Password berhasil disalin');
		} catch {
			toast.error('Gagal menyalin password');
		}
	};
</script>

<svelte:head>
	<title>Daftar Pengguna - Admin</title>
</svelte:head>

{#if data.error}
	<div class="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
		{data.error}
	</div>
{/if}

<section class="rounded-lg border border-border overflow-hidden">
	<div class="flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold">Daftar Pengguna</h2>
			<p class="text-sm text-muted-foreground">{resultLabel}</p>
		</div>
		<Button href="/dashboard/admin/create">Buat Akun Baru</Button>
	</div>

	<div class="space-y-4 border-b border-border px-6 py-4">
		<div class="relative max-w-md">
			<svg
				class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				type="search"
				placeholder="Cari nama atau email..."
				class={cn(inputClass, 'pl-9')}
				value={searchQuery}
				oninput={(event) => handleSearchInput(event.currentTarget.value)}
			/>
		</div>

		<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex flex-wrap gap-2">
				{#each roleOptions as option}
					<button
						type="button"
						class={cn(
							'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
							data.filters.role === option.value
								? 'bg-primary text-primary-foreground'
								: 'bg-muted text-muted-foreground hover:bg-muted/80'
						)}
						onclick={() => updateFilters({ role: option.value })}
					>
						{option.label}
					</button>
				{/each}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<select
					class={cn(inputClass, 'w-full min-w-[180px] lg:w-auto')}
					value={data.filters.major}
					onchange={(event) => updateFilters({ major: event.currentTarget.value })}
				>
					<option value="">Semua Jurusan</option>
					{#each data.majors as majorOption}
						<option value={majorOption}>{majorOption}</option>
					{/each}
				</select>

				{#if hasActiveFilters}
					<Button type="button" variant="outline" size="sm" onclick={clearFilters}>
						Reset Filter
					</Button>
				{/if}
			</div>
		</div>
	</div>

	{#if data.allUsersCount === 0}
		<div class="space-y-4 p-8 text-center">
			<p class="text-muted-foreground">Belum ada pengguna selain admin.</p>
			<Button href="/dashboard/admin/create">Buat Akun Pertama</Button>
		</div>
	{:else if meta.total === 0}
		<div class="space-y-4 p-8 text-center">
			<p class="text-muted-foreground">Tidak ada pengguna yang cocok dengan pencarian atau filter.</p>
			<Button type="button" variant="outline" onclick={clearFilters}>Reset Filter</Button>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left font-medium">Nama</th>
						<th class="px-4 py-3 text-left font-medium">Email</th>
						<th class="px-4 py-3 text-left font-medium">Jurusan</th>
						<th class="px-4 py-3 text-left font-medium">Peran</th>
						<th class="px-4 py-3 text-left font-medium">Password</th>
						<th class="px-4 py-3 text-left font-medium">Aksi</th>
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
							<td class="px-4 py-3">
								{#if user.initialPassword}
									<div class="flex items-center gap-2">
										<code class="rounded bg-muted px-2 py-1 text-xs">{user.initialPassword}</code>
										<button
											type="button"
											class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											title="Salin password"
											aria-label="Salin password"
											onclick={() => copyPassword(user.initialPassword)}
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
								{:else if user.role !== 'ADMIN'}
									<Button href="/dashboard/admin/edit/{user.id}" variant="ghost" size="sm">
										Atur Password
									</Button>
								{:else}
									<span class="text-muted-foreground">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if user.role !== 'ADMIN'}
									<Button href="/dashboard/admin/edit/{user.id}" variant="outline" size="sm">
										Edit
									</Button>
								{:else}
									<span class="text-muted-foreground">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if meta.totalPages > 1}
			<div class="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
				<p class="text-sm text-muted-foreground">
					Menampilkan {(meta.page - 1) * meta.limit + 1} -
					{Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} pengguna
				</p>
				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={meta.page <= 1}
						onclick={() => handlePageChange(meta.page - 1)}
					>
						<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Sebelumnya
					</Button>
					<span class="px-2 text-sm text-muted-foreground">
						{meta.page} / {meta.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={meta.page >= meta.totalPages}
						onclick={() => handlePageChange(meta.page + 1)}
					>
						Selanjutnya
						<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				</div>
			</div>
		{/if}
	{/if}
</section>

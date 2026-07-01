<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import { replaceState } from '$app/navigation';
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

	let filterQ = $state(data.filters.q);
	let filterRole = $state(data.filters.role);
	let filterMajor = $state(data.filters.major);
	let currentPage = $state(data.filters.page);
	const pageLimit = data.filters.limit;

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		filterQ = data.filters.q;
		filterRole = data.filters.role;
		filterMajor = data.filters.major;
		currentPage = data.filters.page;
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

	const statusLabel = (isActive?: boolean) => (isActive === false ? 'Nonaktif' : 'Aktif');

	const statusVariant = (isActive?: boolean) =>
		isActive === false ? ('secondary' as const) : ('default' as const);

	const filteredUsers = $derived.by(() => {
		const q = filterQ.trim().toLowerCase();

		return data.users.filter((user) => {
			if (q) {
				const haystack = `${user.name ?? ''} ${user.email ?? ''}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			if (filterRole && user.role !== filterRole) return false;
			if (filterMajor && user.major !== filterMajor) return false;
			return true;
		});
	});

	const meta = $derived.by(() => {
		const total = filteredUsers.length;
		const totalPages = Math.max(Math.ceil(total / pageLimit), 1);
		const page = Math.min(currentPage, totalPages || 1);

		return {
			total,
			page,
			limit: pageLimit,
			totalPages: total > 0 ? totalPages : 0
		};
	});

	const paginatedUsers = $derived.by(() => {
		const offset = (meta.page - 1) * meta.limit;
		return filteredUsers.slice(offset, offset + meta.limit);
	});

	const hasActiveFilters = $derived(Boolean(filterQ.trim() || filterRole || filterMajor));

	const resultLabel = $derived(
		hasActiveFilters
			? `${meta.total} pengguna cocok dengan filter`
			: `${data.allUsersCount} pengguna terdaftar`
	);

	function syncUrl() {
		const url = new URL($page.url);

		const q = filterQ.trim();
		if (q) url.searchParams.set('q', q);
		else url.searchParams.delete('q');

		if (filterRole) url.searchParams.set('role', filterRole);
		else url.searchParams.delete('role');

		if (filterMajor) url.searchParams.set('major', filterMajor);
		else url.searchParams.delete('major');

		if (currentPage > 1) url.searchParams.set('page', currentPage.toString());
		else url.searchParams.delete('page');

		replaceState(url, {});
	}

	function updateFilters(params: { q?: string; role?: string; major?: string }) {
		if (params.q !== undefined) filterQ = params.q;
		if (params.role !== undefined) filterRole = params.role;
		if (params.major !== undefined) filterMajor = params.major;
		currentPage = 1;
		syncUrl();
	}

	function handleSearchInput(value: string) {
		filterQ = value;
		currentPage = 1;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(syncUrl, 300);
	}

	function handlePageChange(newPage: number) {
		currentPage = newPage;
		syncUrl();
	}

	function clearFilters() {
		filterQ = '';
		filterRole = '';
		filterMajor = '';
		currentPage = 1;
		replaceState('/dashboard/admin', {});
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
		<Button href="/dashboard/admin/create" data-sveltekit-preload-data="hover">Buat Akun Baru</Button>
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
				value={filterQ}
				oninput={(event) => handleSearchInput(event.currentTarget.value)}
			/>
		</div>

		<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex flex-wrap gap-2">
				{#each roleOptions as option}
					<button
						type="button"
						class={cn(
							'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150',
							filterRole === option.value
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
					value={filterMajor}
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
			<Button href="/dashboard/admin/create" data-sveltekit-preload-data="hover">Buat Akun Pertama</Button>
		</div>
	{:else if meta.total === 0}
		<div class="space-y-4 p-8 text-center">
			<p class="text-muted-foreground">Tidak ada pengguna yang cocok dengan pencarian atau filter.</p>
			<Button type="button" variant="outline" onclick={clearFilters}>Reset Filter</Button>
		</div>
	{:else}
		<div class="divide-y divide-border sm:hidden">
			{#each paginatedUsers as user (user.id)}
				<div class="space-y-3 p-4">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="font-medium text-foreground">{user.name}</p>
							<p class="mt-0.5 break-all text-sm text-muted-foreground">{user.email}</p>
						</div>
						<div class="flex shrink-0 flex-col items-end gap-1">
							<Badge variant={roleVariant(user.role)}>
								{roleLabel(user.role)}
							</Badge>
							{#if user.role !== 'ADMIN'}
								<Badge variant={statusVariant(user.isActive)}>
									{statusLabel(user.isActive)}
								</Badge>
							{/if}
						</div>
					</div>

					<dl class="grid grid-cols-2 gap-3 text-sm">
						<div>
							<dt class="text-muted-foreground">Jurusan</dt>
							<dd class="font-medium">{user.major}</dd>
						</div>
						<div>
							<dt class="text-muted-foreground">Password</dt>
							<dd class="mt-0.5">
								{#if user.initialPassword}
									<div class="flex items-center gap-2">
										<code class="rounded bg-muted px-2 py-1 text-xs">{user.initialPassword}</code>
										<button
											type="button"
											class="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
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
									<Button
										href="/dashboard/admin/edit/{user.id}"
										variant="ghost"
										size="sm"
										data-sveltekit-preload-data="hover"
									>
										Atur Password
									</Button>
								{:else}
									<span class="text-muted-foreground">—</span>
								{/if}
							</dd>
						</div>
					</dl>

					{#if user.role !== 'ADMIN'}
						<div class="flex gap-2 pt-1">
							<Button
								href="/dashboard/admin/edit/{user.id}"
								variant="outline"
								size="sm"
								class="flex-1"
								data-sveltekit-preload-data="hover"
							>
								Edit
							</Button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="hidden overflow-x-auto sm:block">
			<table class="w-full text-sm">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left font-medium">Nama</th>
						<th class="px-4 py-3 text-left font-medium">Email</th>
						<th class="px-4 py-3 text-left font-medium">Jurusan</th>
						<th class="px-4 py-3 text-left font-medium">Peran</th>
						<th class="px-4 py-3 text-left font-medium">Status</th>
						<th class="px-4 py-3 text-left font-medium">Password</th>
						<th class="px-4 py-3 text-left font-medium">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedUsers as user (user.id)}
						<tr class="border-t border-border">
							<td class="px-4 py-3">{user.name}</td>
							<td class="px-4 py-3 text-muted-foreground">{user.email}</td>
							<td class="px-4 py-3">{user.major}</td>
							<td class="px-4 py-3">
								<Badge variant={roleVariant(user.role)}>{roleLabel(user.role)}</Badge>
							</td>
							<td class="px-4 py-3">
								{#if user.role !== 'ADMIN'}
									<Badge variant={statusVariant(user.isActive)}>
										{statusLabel(user.isActive)}
									</Badge>
								{:else}
									<span class="text-muted-foreground">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if user.initialPassword}
									<div class="flex items-center gap-2">
										<code class="rounded bg-muted px-2 py-1 text-xs">{user.initialPassword}</code>
										<button
											type="button"
											class="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
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
									<Button href="/dashboard/admin/edit/{user.id}" variant="ghost" size="sm" data-sveltekit-preload-data="hover">
										Atur Password
									</Button>
								{:else}
									<span class="text-muted-foreground">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if user.role !== 'ADMIN'}
									<Button href="/dashboard/admin/edit/{user.id}" variant="outline" size="sm" data-sveltekit-preload-data="hover">
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

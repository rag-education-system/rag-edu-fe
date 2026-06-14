<script lang="ts">
	import type { PageData } from './$types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/utils/format';

	let { data }: { data: PageData } = $props();

	const initials = $derived(
		(data.user?.name || 'User')
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U'
	);

	const roleBadgeVariant = $derived.by(() => {
		switch (data.user?.role) {
			case 'ADMIN':
				return 'destructive';
			case 'TEACHER':
				return 'secondary';
			default:
				return 'outline';
		}
	});

	const roleDisplayName = $derived.by(() => {
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
	<div>
		<h1 class="text-2xl font-bold text-foreground">Profil Saya</h1>
		<p class="text-muted-foreground mt-1">Informasi akun Anda di RAG Education.</p>
	</div>

	{#if data.error}
		<div class="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
			<p class="font-medium text-destructive">Error memuat profil</p>
			<p class="text-sm text-destructive/80 mt-1">{data.error}</p>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<div class="rounded-xl border border-border bg-card p-6">
				<div class="flex flex-col items-center text-center">
					<div
						class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
					>
						<span class="text-3xl font-bold text-primary">{initials}</span>
					</div>

					<h2 class="text-xl font-semibold text-foreground">{data.user?.name || 'User'}</h2>
					<p class="text-sm text-muted-foreground">{data.user?.email || '-'}</p>

					<div class="mt-3">
						<Badge variant={roleBadgeVariant}>{roleDisplayName}</Badge>
					</div>
				</div>
			</div>
		</div>

		<div class="lg:col-span-2">
			<div class="rounded-xl border border-border bg-card p-6 space-y-6">
				<h3 class="text-lg font-semibold text-foreground">Detail Akun</h3>

				<dl class="grid gap-4 sm:grid-cols-2">
					<div>
						<dt class="text-sm text-muted-foreground">Nama</dt>
						<dd class="font-medium">{data.user?.name ?? '-'}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Email</dt>
						<dd class="font-medium">{data.user?.email ?? '-'}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Jurusan</dt>
						<dd class="font-medium">{data.user?.major ?? '-'}</dd>
					</div>
					<div>
						<dt class="text-sm text-muted-foreground">Peran</dt>
						<dd class="font-medium">{roleDisplayName}</dd>
					</div>
				</dl>

				<div class="rounded-md border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
					Pembaruan profil belum tersedia di backend. Hubungi administrator jika perlu mengubah
					data akun.
				</div>

				<Button href="/dashboard" variant="outline">Kembali ke Dashboard</Button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'Terjadi kesalahan');
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
	<p class="text-6xl font-bold text-muted-foreground">{status}</p>
	<h1 class="text-2xl font-semibold text-foreground">
		{#if status === 404}
			Halaman tidak ditemukan
		{:else}
			Terjadi kesalahan
		{/if}
	</h1>
	<p class="max-w-md text-muted-foreground">{message}</p>
	<div class="flex gap-3">
		<Button href="/dashboard">Ke Dashboard</Button>
		<Button variant="outline" href="/">Beranda</Button>
	</div>
</div>

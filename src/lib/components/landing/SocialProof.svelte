<script lang="ts">
	const stats = [
		{ value: 'PDF', label: 'Format didukung' },
		{ value: '2 Mode', label: 'Hybrid & strict chat' },
		{ value: 'RAG', label: 'Teknologi pencarian dokumen' },
		{ value: 'Kampus', label: 'Akun terkelola admin' }
	];
</script>

<section class="border-y border-border/50 bg-muted/30 py-10">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
			{#each stats as stat}
				<div class="text-center md:text-left">
					<p class="text-lg font-bold tracking-tight text-foreground sm:text-xl">{stat.value}</p>
					<p class="mt-1 text-sm text-muted-foreground">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

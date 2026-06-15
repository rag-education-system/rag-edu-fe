<script lang="ts">
	const partners = [
		'Universitas Indonesia',
		'ITB',
		'UGM',
		'IPB',
		'UNAIR',
		'UNDIP',
		'UB',
		'ITS'
	];
</script>

<section class="w-full py-14 px-4 border-y border-border/40">
	<div class="container mx-auto max-w-6xl">
		<p class="landing-label text-center mb-8">Digunakan di berbagai kampus</p>

		<div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
			{#each partners as partner}
				<span class="text-sm font-medium text-muted-foreground/60 hover:text-muted-foreground transition-colors">
					{partner}
				</span>
			{/each}
		</div>
	</div>
</section>

<script lang="ts">
	let { onQuickAction }: { onQuickAction?: (action: string) => void } = $props();

	const quickActions = [
		{ label: 'Buat Ringkasan', icon: 'image' },
		{ label: 'Brainstorm', icon: 'bulb' },
		{ label: 'Buat Rencana', icon: 'document' }
	];

	const featureCards = [
		{
			icon: 'document',
			title: 'Tanya Dokumen',
			description: 'Ajukan pertanyaan tentang dokumen yang sudah diupload.',
			action: 'Mulai Tanya',
			color: 'purple'
		},
		{
			icon: 'presentation',
			title: 'AI Ringkasan',
			description: 'Ubah dokumen menjadi ringkasan yang mudah dipahami.',
			action: 'Buat Ringkasan',
			color: 'pink'
		},
		{
			icon: 'code',
			title: 'Dev Assistant',
			description: 'Bantuan coding dan dokumentasi teknis.',
			action: 'Generate Code',
			color: 'blue'
		}
	];
</script>

{#snippet ImageIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
	</svg>
{/snippet}

{#snippet BulbIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
	</svg>
{/snippet}

{#snippet PresentationIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21l3-3-3-3M17 21l-3-3 3-3M4 4h16M4 8h16M4 12h8" />
	</svg>
{/snippet}

{#snippet CodeIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
	</svg>
{/snippet}

<div class="flex flex-col items-center justify-center py-6 px-4">
	<!-- Animated Orb - Emerald/Green theme -->
	<div class="relative w-28 h-28 mb-6">
		<!-- Outer glow -->
		<div class="absolute inset-0 rounded-full bg-gradient-to-b from-emerald-500/30 via-teal-500/20 to-transparent blur-2xl scale-150"></div>
		<!-- Middle glow ring -->
		<div class="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-600/40 to-teal-600/30 blur-xl animate-pulse"></div>
		<!-- Main orb with gradient -->
		<div class="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl shadow-emerald-500/50">
			<!-- Inner highlight -->
			<div class="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/30"></div>
			<!-- Top shine -->
			<div class="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-white/40 blur-sm"></div>
		</div>
		<!-- Floating particles effect -->
		<div class="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-emerald-400/60 animate-float"></div>
		<div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-float" style="animation-delay: 0.5s;"></div>
	</div>

	<!-- Welcome Text -->
	<h1 class="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-center">
		Siap Membantu Anda
	</h1>
	<p class="text-sm text-muted-foreground mb-8 text-center max-w-md">
		Tanyakan apa saja tentang dokumen yang sudah Anda upload.
	</p>

	<!-- Quick Action Pills -->
	<div class="flex flex-wrap justify-center gap-3 mb-10">
		{#each quickActions as action}
			<button
				type="button"
				class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-200 text-sm text-foreground/90"
				onclick={() => onQuickAction?.(action.label)}
			>
				{#if action.icon === 'image'}
					{@render ImageIcon()}
				{:else if action.icon === 'bulb'}
					{@render BulbIcon()}
				{:else if action.icon === 'document'}
					{@render DocumentIcon()}
				{/if}
				{action.label}
			</button>
		{/each}
	</div>

	<!-- Feature Cards - Matching reference style -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
		{#each featureCards as card}
			<div class="group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md p-5 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 overflow-hidden">
				<!-- Subtle gradient background -->
				<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

				<div class="relative flex flex-col h-full">
					<!-- Top row: Icon and Action button -->
					<div class="flex items-start justify-between mb-4">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-primary">
							{#if card.icon === 'document'}
								{@render DocumentIcon()}
							{:else if card.icon === 'presentation'}
								{@render PresentationIcon()}
							{:else if card.icon === 'code'}
								{@render CodeIcon()}
							{/if}
						</div>
						<button
							type="button"
							class="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
							onclick={() => onQuickAction?.(card.title)}
						>
							{card.action}
						</button>
					</div>

					<!-- Content -->
					<h3 class="font-semibold text-foreground mb-1.5">{card.title}</h3>
					<p class="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

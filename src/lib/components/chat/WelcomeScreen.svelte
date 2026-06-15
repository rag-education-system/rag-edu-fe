<script lang="ts">
	let { onQuickAction }: { onQuickAction?: (action: string) => void } = $props();

	const quickActions = [
		{ label: 'Buat Ringkasan', icon: 'image' },
		{ label: 'Brainstorm', icon: 'bulb' },
		{ label: 'Buat Rencana', icon: 'document' }
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

<div class="flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
	<div class="relative mb-4 h-20 w-20 sm:mb-6 sm:h-28 sm:w-28">
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
	<h1 class="mb-2 text-center text-xl font-semibold text-foreground sm:mb-3 sm:text-2xl md:text-3xl">
		Siap Membantu Anda
	</h1>
	<p class="mb-5 max-w-md text-center text-sm text-muted-foreground sm:mb-8">
		Tanyakan apa saja tentang dokumen yang sudah Anda upload.
	</p>

	<div class="mb-6 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
		{#each quickActions as action}
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-2 text-xs text-foreground/90 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card/70 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
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
</div>

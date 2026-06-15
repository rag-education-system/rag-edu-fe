<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ChatMode } from '$lib/stores/chat.svelte';

	let {
		mode,
		disabled = false,
		onChange
	}: {
		mode: ChatMode;
		disabled?: boolean;
		onChange?: (mode: ChatMode) => void;
	} = $props();
</script>

<div
	class="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-2 px-1"
	role="group"
	aria-label="Mode jawaban chat"
>
	<span class="text-xs text-muted-foreground">Mode:</span>

	<button
		type="button"
		disabled={disabled}
		onclick={() => onChange?.('hybrid')}
		class={cn(
			'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
			mode === 'hybrid'
				? 'border-primary/40 bg-primary/10 text-primary'
				: 'border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground',
			disabled && 'cursor-not-allowed opacity-50'
		)}
	>
		Hybrid Edukatif
	</button>

	<button
		type="button"
		disabled={disabled}
		onclick={() => onChange?.('strict')}
		class={cn(
			'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
			mode === 'strict'
				? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
				: 'border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground',
			disabled && 'cursor-not-allowed opacity-50'
		)}
	>
		Hanya Dokumen
	</button>

	<p class="w-full text-[11px] leading-relaxed text-muted-foreground sm:w-auto sm:flex-1">
		{#if mode === 'hybrid'}
			Boleh jawab dari pengetahuan umum jika dokumen tidak relevan.
		{:else}
			Hanya jawab dari dokumen yang diunggah.
		{/if}
	</p>
</div>

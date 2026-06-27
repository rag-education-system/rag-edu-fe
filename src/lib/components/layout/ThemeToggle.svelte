<script lang="ts">
	import { mode, toggleMode } from 'mode-watcher';
	import { cn } from '$lib/utils';

	let {
		variant = 'sidebar',
		class: className
	}: {
		variant?: 'sidebar' | 'icon';
		class?: string;
	} = $props();

	const isDark = $derived(mode.current === 'dark');
</script>

<button
	type="button"
	onclick={() => toggleMode()}
	class={cn(
		variant === 'sidebar'
			? 'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground'
			: 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground',
		className
	)}
	aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
>
	{#if isDark}
		<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	{:else}
		<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{/if}
	{#if variant === 'sidebar'}
		<span class="font-medium">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
	{/if}
</button>

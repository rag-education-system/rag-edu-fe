<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		href,
		label,
		icon,
		active = false,
		badge,
		onclick,
		class: className
	}: {
		href?: string;
		label: string;
		icon?: Snippet;
		active?: boolean;
		badge?: string | number;
		onclick?: () => void;
		class?: string;
	} = $props();
</script>

{#if href}
	<a
		{href}
		data-sveltekit-preload-data="hover"
		class={cn(
			'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150',
			active
				? 'bg-primary/15 font-medium text-primary'
				: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
			className
		)}
	>
		{#if icon}
			<span class="h-4 w-4 shrink-0">
				{@render icon()}
			</span>
		{/if}
		<span class="flex-1">{label}</span>
		{#if badge}
			<span
				class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary"
			>
				{badge}
			</span>
		{/if}
	</a>
{:else}
	<button
		type="button"
		{onclick}
		class={cn(
			'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150',
			'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
			className
		)}
	>
		{#if icon}
			<span class="h-4 w-4 shrink-0">
				{@render icon()}
			</span>
		{/if}
		<span class="flex-1 text-left">{label}</span>
	</button>
{/if}

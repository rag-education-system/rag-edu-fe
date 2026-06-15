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
			'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150',
			active
				? 'bg-primary/15 text-primary font-medium'
				: 'text-muted-foreground hover:bg-muted hover:text-foreground',
			className
		)}
	>
		{#if icon}
			<span class="w-5 h-5 flex-shrink-0">
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
			'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150',
			'text-muted-foreground hover:bg-muted hover:text-foreground',
			className
		)}
	>
		{#if icon}
			<span class="w-5 h-5 flex-shrink-0">
				{@render icon()}
			</span>
		{/if}
		<span class="flex-1 text-left">{label}</span>
	</button>
{/if}

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		icon,
		highlighted = false,
		class: className,
		...restProps
	}: {
		title: string;
		description: string;
		icon?: Snippet;
		highlighted?: boolean;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 sm:p-7',
		highlighted
			? 'border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-lg shadow-primary/5'
			: 'border-border/60 bg-card hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5',
		className
	)}
	{...restProps}
>
	{#if highlighted}
		<div class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
	{/if}

	{#if icon}
		<div
			class={cn(
				'mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
				highlighted ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-primary/10 text-primary'
			)}
		>
			{@render icon()}
		</div>
	{/if}

	<div class="relative space-y-2">
		<h3 class="text-lg font-bold tracking-tight text-foreground">{title}</h3>
		<p class="text-sm leading-relaxed text-muted-foreground">{description}</p>
	</div>
</div>

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		icon,
		gradient = 'from-primary to-accent',
		class: className,
		...restProps
	}: {
		title: string;
		description: string;
		icon?: Snippet;
		gradient?: string;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		'group relative p-6 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-300 border border-white/10 hover:border-primary/30',
		className
	)}
	{...restProps}
>
	<!-- Hover glow effect -->
	<div
		class="absolute inset-0 rounded-2xl bg-linear-to-br {gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
	></div>

	<div class="relative space-y-4">
		{#if icon}
			<div
				class="w-12 h-12 rounded-xl bg-linear-to-br {gradient} flex items-center justify-center text-background shadow-lg"
			>
				{@render icon()}
			</div>
		{/if}
		<h3 class="text-xl font-semibold">{title}</h3>
		<p class="text-muted-foreground leading-relaxed">{description}</p>
	</div>
</div>

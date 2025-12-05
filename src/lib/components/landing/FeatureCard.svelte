<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		icon,
		class: className,
		...restProps
	}: {
		title: string;
		description: string;
		icon?: Snippet;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<Card class={cn('p-6 transition-shadow hover:shadow-lg', className)} {...restProps}>
	<div class="space-y-4">
		{#if icon}
			<div class="text-primary">
				{@render icon()}
			</div>
		{/if}
		<h3 class="text-xl font-semibold">{title}</h3>
		<p class="text-muted-foreground leading-relaxed">{description}</p>
	</div>
</Card>

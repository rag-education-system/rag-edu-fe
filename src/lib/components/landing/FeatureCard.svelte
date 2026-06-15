<script lang="ts">
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

<div class={cn('landing-card p-6 md:p-8 flex flex-col justify-between h-full', className)} {...restProps}>
	{#if icon}
		<div class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
			{@render icon()}
		</div>
	{/if}
	<div class="space-y-2">
		<h3 class="text-lg font-semibold tracking-tight">{title}</h3>
		<p class="text-sm text-muted-foreground leading-relaxed">{description}</p>
	</div>
</div>

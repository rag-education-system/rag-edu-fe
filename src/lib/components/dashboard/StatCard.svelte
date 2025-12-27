<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	let {
		title,
		value,
		description,
		variant = 'default',
		class: className
	}: {
		title: string;
		value: string | number;
		description?: string;
		variant?: 'default' | 'success' | 'warning' | 'error';
		class?: string;
	} = $props();

	const variantClasses = {
		default: 'border-l-4 border-l-primary',
		success: 'border-l-4 border-l-green-500',
		warning: 'border-l-4 border-l-yellow-500',
		error: 'border-l-4 border-l-destructive'
	};
</script>

<Card class={cn(variantClasses[variant], className)}>
	<CardHeader class="pb-2">
		<CardTitle class="text-sm font-medium text-muted-foreground">{title}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="text-2xl font-bold">{value}</div>
		{#if description}
			<p class="text-xs text-muted-foreground mt-1">{description}</p>
		{/if}
	</CardContent>
</Card>

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		title,
		value,
		description,
		icon,
		variant = 'default',
		trend,
		class: className
	}: {
		title: string;
		value: string | number;
		description?: string;
		icon?: Snippet;
		variant?: 'default' | 'primary' | 'success' | 'warning';
		trend?: { value: number; direction: 'up' | 'down' };
		class?: string;
	} = $props();

	const variantStyles = {
		default: 'bg-card border border-border',
		primary: 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20',
		success: 'bg-gradient-to-br from-green-500/15 via-green-500/5 to-transparent border border-green-500/20',
		warning: 'bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent border border-yellow-500/20'
	};

	const iconStyles = {
		default: 'bg-muted text-muted-foreground',
		primary: 'bg-primary/20 text-primary',
		success: 'bg-green-500/20 text-green-500',
		warning: 'bg-yellow-500/20 text-yellow-500'
	};
</script>

<div class={cn('rounded-xl p-5 transition-all hover:shadow-lg', variantStyles[variant], className)}>
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<p class="text-sm font-medium text-muted-foreground">{title}</p>
			<p class="mt-2 text-3xl font-bold text-foreground">{value}</p>
			{#if description || trend}
				<div class="mt-2 flex items-center gap-2">
					{#if trend}
						<span
							class={cn(
								'inline-flex items-center text-xs font-medium',
								trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
							)}
						>
							{#if trend.direction === 'up'}
								<svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 10l7-7m0 0l7 7m-7-7v18"
									/>
								</svg>
							{:else}
								<svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									/>
								</svg>
							{/if}
							{trend.value}%
						</span>
					{/if}
					{#if description}
						<span class="text-xs text-muted-foreground">{description}</span>
					{/if}
				</div>
			{/if}
		</div>
		{#if icon}
			<div class={cn('rounded-lg p-2.5', iconStyles[variant])}>
				{@render icon()}
			</div>
		{/if}
	</div>
</div>

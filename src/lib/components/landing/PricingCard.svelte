<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		name,
		price,
		period = '/bulan',
		description,
		features,
		cta = 'Mulai Sekarang',
		popular = false,
		href = '/auth/register',
		class: className
	}: {
		name: string;
		price: string;
		period?: string;
		description: string;
		features: string[];
		cta?: string;
		popular?: boolean;
		href?: string;
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.02]',
		popular
			? 'glass-strong border-primary/50 shadow-xl shadow-primary/10'
			: 'glass border-white/10 hover:border-primary/30',
		className
	)}
>
	{#if popular}
		<div
			class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-xs font-semibold text-background"
		>
			Paling Populer
		</div>
	{/if}

	<div class="space-y-6">
		<!-- Plan name and description -->
		<div>
			<h3 class="text-xl font-semibold">{name}</h3>
			<p class="text-muted-foreground text-sm mt-1">{description}</p>
		</div>

		<!-- Price -->
		<div class="flex items-baseline gap-1">
			<span class="text-4xl font-bold">{price}</span>
			{#if period && price !== 'Rp 0'}
				<span class="text-muted-foreground">{period}</span>
			{/if}
		</div>

		<!-- Features list -->
		<ul class="space-y-3">
			{#each features as feature}
				<li class="flex items-start gap-3 text-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-5 h-5 text-primary shrink-0 mt-0.5"
					>
						<path
							fill-rule="evenodd"
							d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-muted-foreground">{feature}</span>
				</li>
			{/each}
		</ul>

		<!-- CTA Button -->
		<Button
			{href}
			class={cn(
				'w-full',
				popular
					? 'bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25'
					: 'border-primary/30 hover:bg-primary/10'
			)}
			variant={popular ? 'default' : 'outline'}
		>
			{cta}
		</Button>
	</div>
</div>

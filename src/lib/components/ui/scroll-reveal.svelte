<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

	let {
		children,
		delay = 0,
		duration = 600,
		direction = 'up',
		threshold = 0.1,
		once = true,
		class: className,
		...restProps
	}: {
		children: Snippet;
		delay?: number;
		duration?: number;
		direction?: Direction;
		threshold?: number;
		once?: boolean;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();

	let element: HTMLDivElement;
	let isVisible = $state(false);

	const animationClasses: Record<Direction, string> = {
		up: 'animate-fade-in-up',
		down: 'animate-fade-in-down',
		left: 'animate-fade-in-left',
		right: 'animate-fade-in-right',
		fade: 'animate-fade-in',
		scale: 'animate-scale-in'
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Add delay before triggering animation
						setTimeout(() => {
							isVisible = true;
						}, delay);

						if (once) {
							observer.unobserve(entry.target);
						}
					} else if (!once) {
						isVisible = false;
					}
				});
			},
			{
				threshold,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		if (element) {
			observer.observe(element);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<div
	bind:this={element}
	class={cn(isVisible ? animationClasses[direction] : 'scroll-hidden', className)}
	style="animation-duration: {duration}ms;"
	{...restProps}
>
	{@render children()}
</div>

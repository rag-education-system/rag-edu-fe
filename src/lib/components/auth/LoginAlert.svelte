<script lang="ts">
	import { cn } from '$lib/utils';
	import type { LoginFeedbackKind } from '$lib/utils/login-feedback';

	let {
		kind,
		title,
		description
	}: {
		kind: LoginFeedbackKind;
		title: string;
		description?: string;
	} = $props();

	const styles: Record<LoginFeedbackKind, string> = {
		error: 'border-destructive/25 bg-destructive/8 text-destructive',
		success: 'border-primary/25 bg-primary/8 text-foreground',
		info: 'border-primary/25 bg-primary/8 text-foreground',
		warning: 'border-amber-500/25 bg-amber-500/10 text-foreground'
	};

	const iconStyles: Record<LoginFeedbackKind, string> = {
		error: 'text-destructive',
		success: 'text-primary',
		info: 'text-primary',
		warning: 'text-amber-600 dark:text-amber-400'
	};
</script>

<div
	role="alert"
	class={cn('rounded-xl border px-4 py-3 text-sm leading-relaxed', styles[kind])}
>
	<div class="flex items-start gap-3">
		<div class={cn('mt-0.5 shrink-0', iconStyles[kind])}>
			{#if kind === 'error'}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{:else if kind === 'success'}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{:else if kind === 'warning'}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
					/>
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{/if}
		</div>
		<div class="min-w-0 space-y-1">
			<p class="font-medium">{title}</p>
			{#if description}
				<p class="text-muted-foreground">{description}</p>
			{/if}
		</div>
	</div>
</div>

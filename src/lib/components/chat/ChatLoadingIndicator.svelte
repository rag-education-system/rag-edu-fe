<script lang="ts">
	let { active = true, statusText = '' }: { active?: boolean; statusText?: string } = $props();

	const subSteps = [
		'Mencari dokumen relevan',
		'Membaca konteks percakapan',
		'Menyusun jawaban'
	];

	let dotCount = $state(1);
	let subStepIndex = $state(0);

	$effect(() => {
		if (!active) return;

		const dotInterval = setInterval(() => {
			dotCount = dotCount >= 3 ? 1 : dotCount + 1;
		}, 450);

		const stepInterval = setInterval(() => {
			subStepIndex = (subStepIndex + 1) % subSteps.length;
		}, 2400);

		return () => {
			clearInterval(dotInterval);
			clearInterval(stepInterval);
		};
	});

	const thinkingText = $derived(`AI sedang berpikir${'.'.repeat(dotCount)}`);
	const subStepText = $derived(
		statusText ? statusText.replace(/\.\.\.$/, '') : subSteps[subStepIndex]
	);
</script>

{#snippet AIIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
		/>
	</svg>
{/snippet}

<div class="flex animate-fade-in-up gap-2 sm:gap-3" role="status" aria-live="polite">
	<div class="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 text-primary sm:h-8 sm:w-8">
		<div class="absolute inset-0 animate-pulse rounded-lg bg-primary/20"></div>
		<div class="relative">
			{@render AIIcon()}
		</div>
	</div>

	<div class="min-w-0 max-w-[92%] rounded-2xl rounded-tl-sm border border-emerald-500/20 bg-card px-4 py-3 shadow-sm sm:max-w-[85%]">
		<p class="text-sm font-semibold text-emerald-400">
			{thinkingText}
		</p>

		<p class="mt-1.5 text-xs text-muted-foreground">
			{subStepText}{statusText ? '' : '...'}
		</p>

		<div class="mt-3 flex items-center gap-1.5">
			<span class="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]"></span>
			<span class="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]"></span>
			<span class="h-2 w-2 animate-bounce rounded-full bg-emerald-400"></span>
		</div>
	</div>
</div>

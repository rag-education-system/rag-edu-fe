<script lang="ts">
	import { cn } from '$lib/utils';

	let { active = true }: { active?: boolean } = $props();

	const steps = [
		'Mencari dokumen relevan...',
		'Membaca konteks percakapan...',
		'Menyusun jawaban...'
	];

	let stepIndex = $state(0);

	$effect(() => {
		if (!active) return;

		const interval = setInterval(() => {
			stepIndex = (stepIndex + 1) % steps.length;
		}, 2200);

		return () => clearInterval(interval);
	});
</script>

{#snippet AIIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
		/>
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

<div class="flex animate-fade-in-up gap-3">
	<div class="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 text-primary">
		<div class="absolute inset-0 rounded-lg bg-primary/20 animate-pulse-glow"></div>
		<div class="relative">
			{@render AIIcon()}
		</div>
	</div>

	<div class="min-w-[240px] max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-4 shadow-sm">
		<div class="mb-3 flex items-center gap-2">
			<div class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
				<div class="absolute inset-0 rounded-lg border border-emerald-500/20 animate-pulse"></div>
				<div class="animate-bounce [animation-duration:1.4s]">
					{@render DocumentIcon()}
				</div>
			</div>

			<div class="relative h-8 flex-1 overflow-hidden rounded-lg bg-muted/40">
				<div class="absolute inset-y-0 left-0 w-1/3 rounded-lg bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]"></div>
				<div class="absolute inset-0 flex items-center px-3">
					<div class="space-y-1.5 w-full">
						<div class="h-1.5 w-full rounded-full bg-muted/80"></div>
						<div class="h-1.5 w-4/5 rounded-full bg-muted/60"></div>
					</div>
				</div>
			</div>
		</div>

		<p class="mb-3 text-sm text-foreground/90 transition-opacity duration-300">
			{steps[stepIndex]}
		</p>

		<div class="mb-3 h-1 overflow-hidden rounded-full bg-muted/50">
			<div class="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-[progress_1.6s_ease-in-out_infinite]"></div>
		</div>

		<div class="flex items-center gap-1.5">
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
			<span class="ml-2 text-[11px] text-muted-foreground">AI sedang berpikir</span>
		</div>
	</div>
</div>

<style>
	@keyframes shimmer {
		0% {
			transform: translateX(-120%);
		}
		100% {
			transform: translateX(350%);
		}
	}

	@keyframes progress {
		0% {
			transform: translateX(-120%);
		}
		100% {
			transform: translateX(420%);
		}
	}
</style>

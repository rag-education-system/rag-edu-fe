<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		value = $bindable(''),
		placeholder = 'Ask Anything...',
		disabled = false,
		loading = false,
		onsubmit
	}: {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		loading?: boolean;
		onsubmit?: (message: string) => void;
	} = $props();

	let textarea: HTMLTextAreaElement;

	function autoResize() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
		}
	}

	function handleSubmit() {
		if (value.trim() && !disabled && !loading) {
			onsubmit?.(value.trim());
			value = '';
			if (textarea) {
				textarea.style.height = 'auto';
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	$effect(() => {
		value;
		autoResize();
	});
</script>

{#snippet SparkleIcon()}
	<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
		<path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
	</svg>
{/snippet}

{#snippet MicIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
	</svg>
{/snippet}

{#snippet SendIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
	</svg>
{/snippet}

{#snippet LoadingIcon()}
	<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
		<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
{/snippet}

<div class="mx-auto w-full max-w-3xl">
	<div class="relative rounded-2xl border border-border/60 bg-card/40 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-primary/5 sm:shadow-xl">
		<div class="flex items-start gap-2 p-3 pb-2 sm:gap-3 sm:p-4 sm:pb-3">
			<div class="mt-0.5 hidden text-emerald-400/80 sm:block">
				{@render SparkleIcon()}
			</div>
			<textarea
				bind:this={textarea}
				bind:value
				{placeholder}
				{disabled}
				rows="1"
				class={cn(
					'min-h-[24px] max-h-[120px] flex-1 resize-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 sm:min-h-[28px] sm:max-h-[200px]',
					'focus:outline-none'
				)}
				onkeydown={handleKeydown}
				oninput={autoResize}
			></textarea>
		</div>

		<div class="flex items-center justify-end border-t border-border/30 px-3 py-2 sm:px-4 sm:py-3">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground sm:inline-flex"
					aria-label="Voice input"
				>
					{@render MicIcon()}
				</button>

				<button
					type="button"
					onclick={handleSubmit}
					disabled={disabled || loading || !value.trim()}
					class={cn(
						'inline-flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10',
						'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
						'hover:from-emerald-600 hover:to-teal-600 active:scale-95',
						'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
						'transition-all duration-200',
						'shadow-lg shadow-emerald-500/30'
					)}
					aria-label="Send message"
				>
					{#if loading}
						{@render LoadingIcon()}
					{:else}
						{@render SendIcon()}
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

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

{#snippet AttachIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
	</svg>
{/snippet}

{#snippet SettingsIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
	</svg>
{/snippet}

{#snippet OptionsIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
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

<div class="w-full max-w-3xl mx-auto">
	<div class="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-xl shadow-black/10 focus-within:border-primary/40 focus-within:shadow-primary/5 transition-all duration-300">
		<!-- Top row with sparkle and textarea -->
		<div class="flex items-start gap-3 p-4 pb-3">
			<div class="text-emerald-400/80 mt-0.5">
				{@render SparkleIcon()}
			</div>
			<textarea
				bind:this={textarea}
				bind:value
				{placeholder}
				{disabled}
				rows="1"
				class={cn(
					'flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground/60',
					'focus:outline-none text-base leading-relaxed',
					'min-h-[28px] max-h-[200px]'
				)}
				onkeydown={handleKeydown}
				oninput={autoResize}
			></textarea>
		</div>

		<!-- Bottom toolbar - matching reference design -->
		<div class="flex items-center justify-between px-4 py-3 border-t border-border/30">
			<!-- Left side buttons -->
			<div class="flex items-center gap-1">
				<button
					type="button"
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
					aria-label="Attach file"
				>
					{@render AttachIcon()}
					<span>Attach</span>
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
					aria-label="Settings"
				>
					{@render SettingsIcon()}
					<span>Settings</span>
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
					aria-label="Options"
				>
					{@render OptionsIcon()}
					<span>Options</span>
				</button>
			</div>

			<!-- Right side buttons -->
			<div class="flex items-center gap-2">
				<!-- Mic button -->
				<button
					type="button"
					class="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
					aria-label="Voice input"
				>
					{@render MicIcon()}
				</button>

				<!-- Send button -->
				<button
					type="button"
					onclick={handleSubmit}
					disabled={disabled || loading || !value.trim()}
					class={cn(
						'inline-flex items-center justify-center w-9 h-9 rounded-full',
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

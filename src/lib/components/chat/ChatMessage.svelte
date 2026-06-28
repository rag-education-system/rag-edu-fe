<script lang="ts">
	import { cn } from '$lib/utils';
	import type { QuerySourceDto } from '$lib/types/api';
	import ChatSources from './ChatSources.svelte';
	import MarkdownContent from './MarkdownContent.svelte';
	import { toast } from 'svelte-sonner';

	type MessageRole = 'user' | 'assistant';

	let {
		role,
		content,
		sources,
		timestamp,
		responseType,
		isLoading = false,
		isStreaming = false,
		streamStatus = '',
		onSourceSelect
	}: {
		role: MessageRole;
		content: string;
		sources?: QuerySourceDto[];
		timestamp?: Date;
		responseType?: 'document' | 'general' | 'refusal';
		isLoading?: boolean;
		isStreaming?: boolean;
		streamStatus?: string;
		onSourceSelect?: (source: QuerySourceDto) => void;
	} = $props();

	const isUser = $derived(role === 'user');
	const canCopy = $derived(!isUser && !isLoading && Boolean(content.trim()) && !isStreaming);

	let copied = $state(false);

	function formatTime(date?: Date): string {
		if (!date) return '';
		return new Intl.DateTimeFormat('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	async function copyAnswer() {
		if (!content.trim()) return;

		try {
			await navigator.clipboard.writeText(content);
			copied = true;
			toast.success('Jawaban disalin ke clipboard');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			toast.error('Gagal menyalin jawaban');
		}
	}
</script>

{#snippet UserIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
	</svg>
{/snippet}

{#snippet AIIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
	</svg>
{/snippet}

{#snippet CopyIcon()}
	<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
{/snippet}

{#snippet CheckIcon()}
	<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
	</svg>
{/snippet}

{#snippet LoadingDots()}
	<div class="flex items-center gap-1">
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></span>
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></span>
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></span>
	</div>
{/snippet}

<div
	class={cn(
		'flex animate-fade-in-up gap-2 sm:gap-3',
		isUser ? 'flex-row-reverse' : 'flex-row'
	)}
>
	<!-- Avatar -->
	<div
		class={cn(
			'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8',
			isUser
				? 'bg-primary/20 text-primary'
				: 'bg-gradient-to-br from-primary/30 to-accent/20 text-primary'
		)}
	>
		{#if isUser}
			{@render UserIcon()}
		{:else}
			{@render AIIcon()}
		{/if}
	</div>

	<!-- Message content -->
	<div class={cn('min-w-0 flex-1 max-w-[92%] sm:max-w-[85%] lg:max-w-[80%]', isUser ? 'flex flex-col items-end' : '')}>
		<!-- Message bubble -->
		<div
			class={cn(
				'relative rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3',
				isUser
					? 'bg-primary/20 text-foreground rounded-tr-sm'
					: 'bg-card border border-border rounded-tl-sm'
			)}
		>
			{#if canCopy}
				<button
					type="button"
					onclick={copyAnswer}
					class={cn(
						'absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background/90 px-2 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all',
						'hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
						copied && 'border-emerald-500/40 text-emerald-500'
					)}
					aria-label={copied ? 'Jawaban tersalin' : 'Salin jawaban'}
				>
					{#if copied}
						{@render CheckIcon()}
						<span>Tersalin</span>
					{:else}
						{@render CopyIcon()}
						<span>Salin</span>
					{/if}
				</button>
			{/if}

			{#if isLoading}
				{@render LoadingDots()}
			{:else if isUser}
				<p class="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
			{:else if isStreaming && !content}
				<div class="space-y-1.5" role="status" aria-live="polite">
					<p class="text-sm font-medium text-emerald-400">AI sedang berpikir...</p>
					{#if streamStatus}
						<p class="text-xs text-muted-foreground">{streamStatus}</p>
					{/if}
					<div class="flex items-center gap-1 pt-0.5">
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]"></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]"></span>
						<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"></span>
					</div>
				</div>
			{:else}
				<div class={cn(canCopy && 'pt-7')}>
					<MarkdownContent {content} streaming={isStreaming} />
				</div>
			{/if}
		</div>

		{#if !isUser && !isLoading && responseType === 'general'}
			<div class="mt-2 w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
				Jawaban ini <strong>tidak bersumber dari dokumen Anda</strong> — dihasilkan dari pengetahuan umum model AI.
			</div>
		{/if}

		{#if !isUser && !isLoading && responseType === 'refusal'}
			<div class="mt-2 w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
				Tidak ada sumber dokumen yang relevan untuk pertanyaan ini.
			</div>
		{/if}

		<!-- Sources (only for AI messages) -->
		{#if !isUser && sources && sources.length > 0}
			<div class="mt-2 w-full">
				<ChatSources {sources} {onSourceSelect} />
			</div>
		{/if}

		<!-- Timestamp -->
		{#if timestamp && !isLoading}
			<span class="text-[10px] text-muted-foreground mt-1 px-1">
				{formatTime(timestamp)}
			</span>
		{/if}
	</div>
</div>

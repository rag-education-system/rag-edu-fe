<script lang="ts">
	import { cn } from '$lib/utils';
	import type { QuerySourceDto } from '$lib/types/api';
	import ChatSources from './ChatSources.svelte';

	type MessageRole = 'user' | 'assistant';

	let {
		role,
		content,
		sources,
		timestamp,
		isLoading = false
	}: {
		role: MessageRole;
		content: string;
		sources?: QuerySourceDto[];
		timestamp?: Date;
		isLoading?: boolean;
	} = $props();

	const isUser = $derived(role === 'user');

	function formatTime(date?: Date): string {
		if (!date) return '';
		return new Intl.DateTimeFormat('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
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

{#snippet LoadingDots()}
	<div class="flex items-center gap-1">
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></span>
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></span>
		<span class="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></span>
	</div>
{/snippet}

<div
	class={cn(
		'flex gap-3 animate-fade-in-up',
		isUser ? 'flex-row-reverse' : 'flex-row'
	)}
>
	<!-- Avatar -->
	<div
		class={cn(
			'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
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
	<div class={cn('flex-1 max-w-[80%]', isUser ? 'flex flex-col items-end' : '')}>
		<!-- Message bubble -->
		<div
			class={cn(
				'rounded-2xl px-4 py-3',
				isUser
					? 'bg-primary/20 text-foreground rounded-tr-sm'
					: 'bg-card border border-border rounded-tl-sm'
			)}
		>
			{#if isLoading}
				{@render LoadingDots()}
			{:else}
				<p class="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
			{/if}
		</div>

		<!-- Sources (only for AI messages) -->
		{#if !isUser && sources && sources.length > 0}
			<div class="mt-2 w-full">
				<ChatSources {sources} />
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

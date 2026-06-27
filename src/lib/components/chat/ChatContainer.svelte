<script lang="ts">
	import type { ChatMessageData } from '$lib/stores/chat.svelte';
	import type { QuerySourceDto } from '$lib/types/api';
	import ChatMessage from './ChatMessage.svelte';
	import ChatLoadingIndicator from './ChatLoadingIndicator.svelte';
	import WelcomeScreen from './WelcomeScreen.svelte';

	export type { ChatMessageData };

	let {
		messages = [],
		isLoading = false,
		streamStatus = '',
		onQuickAction,
		onSourceSelect
	}: {
		messages?: ChatMessageData[];
		isLoading?: boolean;
		streamStatus?: string;
		onQuickAction?: (action: string) => void;
		onSourceSelect?: (source: QuerySourceDto) => void;
	} = $props();

	let messagesContainer = $state<HTMLDivElement | null>(null);

	const hasMessages = $derived(messages.length > 0);

	// Auto-scroll to bottom when new messages arrive or loading starts
	$effect(() => {
		messages;
		isLoading;
		const container = messagesContainer;
		if (container) {
			requestAnimationFrame(() => {
				container.scrollTop = container.scrollHeight;
			});
		}
	});
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
	<div
		bind:this={messagesContainer}
		class="flex-1 space-y-4 overflow-y-auto scroll-smooth px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6"
	>
		{#if !hasMessages && !isLoading}
			<div class="flex min-h-full items-center justify-center">
				<WelcomeScreen {onQuickAction} />
			</div>
		{:else}
			{#each messages as message, index (message.id)}
				<ChatMessage
					role={message.role}
					content={message.content}
					sources={message.sources}
					timestamp={message.timestamp}
					responseType={message.responseType}
					isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
					{onSourceSelect}
				/>
			{/each}

			{#if isLoading && (messages.length === 0 || messages[messages.length - 1]?.role !== 'assistant' || !messages[messages.length - 1]?.content)}
				<ChatLoadingIndicator active={isLoading} statusText={streamStatus} />
			{/if}
		{/if}
	</div>
</div>

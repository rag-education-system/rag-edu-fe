<script lang="ts">
	import type { ChatMessageData } from '$lib/stores/chat.svelte';
	import type { QuerySourceDto } from '$lib/types/api';
	import ChatMessage from './ChatMessage.svelte';
	import WelcomeScreen from './WelcomeScreen.svelte';

	export type { ChatMessageData };

	let {
		messages = [],
		isLoading = false,
		onQuickAction,
		onSourceSelect
	}: {
		messages?: ChatMessageData[];
		isLoading?: boolean;
		onQuickAction?: (action: string) => void;
		onSourceSelect?: (source: QuerySourceDto) => void;
	} = $props();

	let messagesContainer = $state<HTMLDivElement | null>(null);

	const hasMessages = $derived(messages.length > 0);

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		messages;
		isLoading;
		const container = messagesContainer;
		if (container) {
			setTimeout(() => {
				container.scrollTop = container.scrollHeight;
			}, 100);
		}
	});
</script>

<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
	{#if hasMessages}
		<!-- Messages list -->
		<div
			bind:this={messagesContainer}
			class="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth"
		>
			{#each messages as message (message.id)}
				<ChatMessage
					role={message.role}
					content={message.content}
					sources={message.sources}
					timestamp={message.timestamp}
					{onSourceSelect}
				/>
			{/each}

			<!-- Loading indicator -->
			{#if isLoading}
				<ChatMessage role="assistant" content="" isLoading={true} />
			{/if}
		</div>
	{:else}
		<!-- Welcome screen -->
		<div class="flex-1 overflow-y-auto flex items-center justify-center">
			<WelcomeScreen {onQuickAction} />
		</div>
	{/if}
</div>

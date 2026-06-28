import { goto } from '$app/navigation';
import { chatStore } from '$lib/stores/chat.svelte';

export async function logout(redirectTo = '/auth/login?info=logged-out') {
	chatStore.reset();
	await fetch('/api/auth/logout', { method: 'POST' });
	await goto(redirectTo);
}

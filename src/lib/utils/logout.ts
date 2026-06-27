import { goto } from '$app/navigation';

export async function logout(redirectTo = '/auth/login?info=logged-out') {
	await fetch('/api/auth/logout', { method: 'POST' });
	await goto(redirectTo);
}

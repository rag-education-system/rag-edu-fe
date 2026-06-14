import { goto } from '$app/navigation';

export async function logout(redirectTo = '/auth/login') {
	await fetch('/api/auth/logout', { method: 'POST' });
	await goto(redirectTo);
}

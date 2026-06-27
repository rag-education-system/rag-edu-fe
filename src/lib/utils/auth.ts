import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { DtoUserInfo } from '$lib/api/api';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

function loginRedirectPath(event: RequestEvent, info?: string) {
	const redirectTo = event.url.pathname + event.url.search;
	const params = new URLSearchParams({ redirect: redirectTo });
	if (info) params.set('info', info);
	return `/auth/login?${params.toString()}`;
}

export function requireAuth(event: RequestEvent) {
	if (!event.locals.user || !event.locals.token) {
		throw redirect(303, loginRedirectPath(event, 'required'));
	}

	return { user: event.locals.user as DtoUserInfo, token: event.locals.token };
}

export function requireAdmin(event: RequestEvent) {
	const { user, token } = requireAuth(event);

	if (user.role !== 'ADMIN') {
		throw redirect(303, '/dashboard');
	}

	return { user, token };
}

export function authHeaders(token: string) {
	return { Authorization: `Bearer ${token}` };
}

export function clearAuthCookies(event: RequestEvent) {
	event.cookies.delete('auth_token', { path: '/' });
	event.cookies.delete('user', { path: '/' });
}

export function redirectToLogin(event: RequestEvent) {
	clearAuthCookies(event);
	throw redirect(303, loginRedirectPath(event, 'session-expired'));
}

import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { DtoUserInfo } from '$lib/api/api';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export function requireAuth(event: RequestEvent) {
	if (!event.locals.user || !event.locals.token) {
		throw redirect(303, '/auth/login');
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

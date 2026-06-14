import { api } from '$lib/api/client';
import { setCookieWithDefaults } from '$lib/utils/cookie';
import {
	checkRateLimit,
	rateLimitKey,
	resolveFrontendLimit
} from '$lib/server/rate-limit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AxiosError } from 'axios';
import type { DtoUserInfo } from '$lib/api/api';

function parseUserCookie(raw: string | undefined): DtoUserInfo | undefined {
	if (!raw) return undefined;

	try {
		return JSON.parse(raw) as DtoUserInfo;
	} catch {
		return undefined;
	}
}

export const rateLimit: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const limit = resolveFrontendLimit(pathname);
	const key = rateLimitKey(event.getClientAddress(), pathname);

	if (!checkRateLimit(key, limit.max, limit.windowMs)) {
		return new Response(
			JSON.stringify({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' }),
			{
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '60'
				}
			}
		);
	}

	return resolve(event);
};

export const auth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_token');
	event.locals.token = token ?? null;

	if (!token) {
		event.locals.user = undefined;
		return resolve(event);
	}

	event.locals.user = parseUserCookie(event.cookies.get('user'));

	try {
		const response = await api.authMeList({
			headers: { Authorization: `Bearer ${token}` }
		});

		const userData = response.data.user;
		if (userData) {
			setCookieWithDefaults(event.cookies, 'user', JSON.stringify(userData));
			event.locals.user = userData;
		}
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 401) {
			event.cookies.delete('auth_token', { path: '/' });
			event.cookies.delete('user', { path: '/' });
			event.locals.token = null;
			event.locals.user = undefined;
		}
	}

	return resolve(event);
};

export const handle = sequence(rateLimit, auth);

import { api } from '$lib/api/client';
import { setCookieWithDefaults } from '$lib/utils/cookie';
import {
	checkRateLimit,
	rateLimitKey,
	resolveFrontendLimit,
	shouldSkipRateLimit
} from '$lib/server/rate-limit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AxiosError } from 'axios';
import type { DtoUserInfo } from '$lib/api/api';

const AUTH_ME_REFRESH_MS = 5 * 60 * 1000;

function parseUserCookie(raw: string | undefined): DtoUserInfo | undefined {
	if (!raw) return undefined;

	try {
		return JSON.parse(raw) as DtoUserInfo;
	} catch {
		return undefined;
	}
}

function shouldRefreshAuthMe(validatedAt: string | undefined): boolean {
	if (!validatedAt) return true;
	const parsed = Number(validatedAt);
	if (!Number.isFinite(parsed)) return true;
	return Date.now() - parsed >= AUTH_ME_REFRESH_MS;
}

export const rateLimit: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const method = event.request.method;

	if (shouldSkipRateLimit(pathname, method)) {
		return resolve(event);
	}

	const limit = resolveFrontendLimit(pathname, method);
	const key = rateLimitKey(event.getClientAddress(), `${method}:${pathname}`);

	if (!checkRateLimit(key, limit.max, limit.windowMs)) {
		const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');

		if (acceptsHtml) {
			return new Response(
				'Terlalu banyak permintaan. Tunggu sekitar 1 menit lalu muat ulang halaman.',
				{
					status: 429,
					headers: {
						'Content-Type': 'text/plain; charset=utf-8',
						'Retry-After': '60'
					}
				}
			);
		}

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

	if (!shouldRefreshAuthMe(event.cookies.get('auth_validated_at'))) {
		return resolve(event);
	}

	try {
		const response = await api.authMeList({
			headers: { Authorization: `Bearer ${token}` }
		});

		const userData = response.data.user;
		if (userData) {
			setCookieWithDefaults(event.cookies, 'user', JSON.stringify(userData));
			setCookieWithDefaults(event.cookies, 'auth_validated_at', String(Date.now()), {
				maxAge: 60 * 60 * 24
			});
			event.locals.user = userData;
		}
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 401) {
			event.cookies.delete('auth_token', { path: '/' });
			event.cookies.delete('user', { path: '/' });
			event.cookies.delete('auth_validated_at', { path: '/' });
			event.locals.token = null;
			event.locals.user = undefined;
		}
	}

	return resolve(event);
};

export const handle = sequence(rateLimit, auth);

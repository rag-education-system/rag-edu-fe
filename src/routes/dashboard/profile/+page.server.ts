import { api } from '$lib/api/client';
import { authHeaders, redirectToLogin, requireAuth } from '$lib/utils/auth';
import type { PageServerLoad } from './$types';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAuth(event);

	try {
		const response = await api.authMeList({
			headers: authHeaders(token)
		});

		const user = response.data.user;

		return { user };
	} catch (err) {
		if (err instanceof AxiosError && err.response?.status === 401) {
			redirectToLogin(event);
		}

		return {
			user: event.locals.user,
			error: 'Gagal memuat data profil'
		};
	}
};

import { api } from '$lib/api/client';
import { authHeaders, requireAuth } from '$lib/utils/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { updateProfileSchema } from '$lib/zod4_schema/profile';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAuth(event);

	try {
		const response = await api.authMeList({
			headers: authHeaders(token)
		});

		const user = response.data.user;

		const form = await superValidate(
			{
				name: user?.name ?? '',
				email: user?.email ?? '',
				major: user?.major ?? '',
				password: ''
			},
			zod4(updateProfileSchema)
		);

		return { form, user };
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 401) {
			event.cookies.delete('auth_token', { path: '/' });
			event.cookies.delete('user', { path: '/' });
			throw redirect(303, '/auth/login');
		}

		return {
			form: await superValidate(zod4(updateProfileSchema)),
			user: event.locals.user,
			error: 'Gagal memuat data profil'
		};
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod4(updateProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		return message(
			form,
			{ error: true, message: 'Pembaruan profil belum tersedia. Hubungi administrator.' },
			{ status: 501 }
		);
	}
};

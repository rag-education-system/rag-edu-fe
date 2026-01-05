import { api } from '$lib/api/client';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { updateProfileSchema } from '$lib/zod4_schema/profile';
import { AxiosError } from 'axios';
import { setCookieWithDefaults } from '$lib/utils/cookie';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Redirect jika belum login
	if (!locals.token) {
		throw redirect(303, '/auth/login?redirect=/dashboard/profile');
	}

	try {
		// Fetch user data dari API
		const response = await api.usersControllerGetCurrentUser({
			headers: { Authorization: `Bearer ${locals.token}` }
		});

		const user = response.data;

		// Initialize form dengan data user
		const form = await superValidate(
			{
				name: user.name,
				email: user.email,
				major: user.major,
				password: ''
			},
			zod4(updateProfileSchema)
		);

		return {
			form,
			user
		};
	} catch (error) {
		// Handle 401 - token expired
		if (error instanceof AxiosError && error.response?.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			throw redirect(303, '/auth/login');
		}

		// Return empty form on error
		return {
			form: await superValidate(zod4(updateProfileSchema)),
			user: locals.user,
			error: 'Gagal memuat data profil'
		};
	}
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod4(updateProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!locals.token || !locals.user) {
			throw redirect(303, '/auth/login');
		}

		try {
			// Prepare update payload
			const updateData: { name: string; email: string; } = {
				name: form.data.name,
				email: form.data.email,
			};


			// Call API to update user
			const response = await api.usersControllerUpdateUser(locals.user.id, updateData, {
				headers: { Authorization: `Bearer ${locals.token}` }
			});

			// Update user cookie with new data
			const updatedUser = response.data;
			setCookieWithDefaults(cookies, 'user', JSON.stringify(updatedUser));

			// Return success with message
			return message(form, { error: false, message: 'Profil berhasil diperbarui' });
		} catch (error) {
			if (error instanceof AxiosError) {
				// Handle 401 - token expired
				if (error.response?.status === 401) {
					cookies.delete('auth_token', { path: '/' });
					cookies.delete('user', { path: '/' });
					throw redirect(303, '/auth/login');
				}

				// Return error message from API
				const errorMessage = error.response?.data?.message || 'Gagal memperbarui profil';
				return message(form, { error: true, message: errorMessage }, { status: 400 });
			}

			return message(form, { error: true, message: 'Terjadi kesalahan server' }, { status: 500 });
		}
	}
};

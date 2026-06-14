import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import { createUserSchema } from '$lib/zod4_schema/user';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAdmin(event);

	try {
		const response = await api.usersList({
			headers: authHeaders(token)
		});

		return {
			users: response.data.data ?? [],
			form: await superValidate(
				{ role: 'STUDENT', email: '', name: '', major: '', password: '' },
				zod4(createUserSchema)
			)
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			return {
				users: [],
				form: await superValidate(zod4(createUserSchema)),
				error: error.response?.data?.error ?? 'Gagal memuat daftar pengguna'
			};
		}

		throw error;
	}
};

export const actions: Actions = {
	create: async (event) => {
		const { token } = requireAdmin(event);
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod4(createUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await api.usersCreate(form.data, {
				headers: authHeaders(token)
			});

			return message(form, {
				error: false,
				message:
					form.data.role === 'TEACHER'
						? 'Akun dosen berhasil dibuat'
						: 'Akun mahasiswa berhasil dibuat'
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const apiError = error.response?.data?.error ?? 'Gagal membuat akun';
				return message(form, { error: true, message: apiError }, { status: error.response?.status ?? 400 });
			}

			return message(form, { error: true, message: 'Terjadi kesalahan server' }, { status: 500 });
		}
	}
};

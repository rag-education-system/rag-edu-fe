import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import { createUserSchema } from '$lib/zod4_schema/user';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(
			{ role: 'STUDENT', email: '', name: '', major: '', password: '' },
			zod4(createUserSchema)
		)
	};
};

export const actions: Actions = {
	default: async (event) => {
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
						: 'Akun mahasiswa berhasil dibuat',
				email: form.data.email,
				password: form.data.password
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const apiError = error.response?.data?.error ?? 'Gagal membuat akun';
				const status = (error.response?.status ?? 400) as 400 | 401 | 403 | 404 | 500;
				return message(form, { error: true, message: apiError }, { status });
			}

			return message(form, { error: true, message: 'Terjadi kesalahan server' }, { status: 500 });
		}
	}
};

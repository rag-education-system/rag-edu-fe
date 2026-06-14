import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import { updateUserSchema } from '$lib/zod4_schema/user';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAdmin(event);
	const userId = event.params.id;

	try {
		const response = await api.usersList({
			headers: authHeaders(token)
		});

		const user = response.data.data?.find((item) => item.id === userId);
		if (!user) {
			throw error(404, 'Pengguna tidak ditemukan');
		}
		if (user.role === 'ADMIN') {
			throw error(403, 'Akun admin tidak dapat diedit');
		}

		return {
			user,
			form: await superValidate(
				{
					role: (user.role as 'STUDENT' | 'TEACHER') ?? 'STUDENT',
					email: user.email ?? '',
					name: user.name ?? '',
					major: user.major ?? '',
					password: ''
				},
				zod4(updateUserSchema)
			)
		};
	} catch (err) {
		if (err instanceof AxiosError) {
			throw error(err.response?.status ?? 500, err.response?.data?.error ?? 'Gagal memuat data pengguna');
		}
		throw err;
	}
};

export const actions: Actions = {
	default: async (event) => {
		const { token } = requireAdmin(event);
		const userId = event.params.id;
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod4(updateUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const payload = {
				email: form.data.email,
				name: form.data.name,
				major: form.data.major,
				role: form.data.role,
				...(form.data.password ? { password: form.data.password } : {})
			};

			await api.usersUpdate(userId, payload, {
				headers: authHeaders(token)
			});

			throw redirect(303, '/dashboard/admin');
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
				throw err;
			}
			if (err instanceof AxiosError) {
				const apiError = err.response?.data?.error ?? 'Gagal memperbarui akun';
				const status = (err.response?.status ?? 400) as 400 | 401 | 403 | 404 | 500;
				return message(form, { error: true, message: apiError }, { status });
			}

			return message(form, { error: true, message: 'Terjadi kesalahan server' }, { status: 500 });
		}
	}
};

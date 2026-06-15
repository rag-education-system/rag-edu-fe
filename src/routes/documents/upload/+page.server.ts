import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.token) {
		throw redirect(303, '/auth/login?redirect=/documents/upload');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.token) {
			throw redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		let visibility = formData.get('visibility') as 'PUBLIC' | 'PRIVATE' | null;

		// Mahasiswa selalu private
		if (locals.user?.role === 'STUDENT') {
			visibility = 'PRIVATE';
		}

		if (!file || file.size === 0) {
			return fail(400, {
				error: 'File harus dipilih',
				success: false
			});
		}

		// Validate file type
		const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
		if (!allowedTypes.includes(file.type)) {
			return fail(400, {
				error: 'Tipe file tidak didukung. Gunakan PDF, PNG, JPG, atau JPEG.',
				success: false
			});
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return fail(400, {
				error: 'Ukuran file maksimal 10MB',
				success: false
			});
		}

		try {
			const response = await api.documentsUploadCreate(
				{
					file: file,
					visibility: visibility || 'PRIVATE'
				},
				{
					headers: {
						Authorization: `Bearer ${locals.token}`
					}
				}
			);

			return {
				success: true,
				data: response.data
			};
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					cookies.delete('auth_token', { path: '/' });
					cookies.delete('user', { path: '/' });
					throw redirect(303, '/auth/login');
				}

				const message = err.response?.data?.message || 'Gagal upload dokumen';
				return fail(err.response?.status || 500, {
					error: Array.isArray(message) ? message[0] : message,
					success: false
				});
			}

			return fail(500, {
				error: 'Terjadi kesalahan saat upload',
				success: false
			});
		}
	}
};

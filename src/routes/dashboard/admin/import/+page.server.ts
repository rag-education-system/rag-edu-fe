import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { AxiosError } from 'axios';
import type { DtoBulkImportUsersResponse } from '$lib/api/api';

export const load: PageServerLoad = async (event) => {
	requireAdmin(event);
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const { token } = requireAdmin(event);
		const formData = await event.request.formData();
		const file = formData.get('file') as File | null;

		if (!file || file.size === 0) {
			return fail(400, {
				success: false,
				error: 'File wajib dipilih'
			});
		}

		const allowedExtensions = ['.csv', '.xlsx', '.xlsm', '.xltx', '.xltm'];
		const fileName = file.name.toLowerCase();
		const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
		if (!hasValidExtension) {
			return fail(400, {
				success: false,
				error: 'Format tidak didukung. Gunakan CSV atau XLSX.'
			});
		}

		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			return fail(400, {
				success: false,
				error: 'Ukuran file maksimal 5MB'
			});
		}

		try {
			const response = await api.usersImportCreate({ file }, { headers: authHeaders(token) });

			return {
				success: true,
				result: response.data as DtoBulkImportUsersResponse
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				const apiError = error.response?.data?.error ?? 'Gagal mengimport file';
				return fail((error.response?.status ?? 400) as 400 | 500, {
					success: false,
					error: apiError
				});
			}

			return fail(500, {
				success: false,
				error: 'Terjadi kesalahan server'
			});
		}
	}
};

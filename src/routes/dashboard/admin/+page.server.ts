import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import type { PageServerLoad } from './$types';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAdmin(event);

	const q = event.url.searchParams.get('q')?.trim() ?? '';
	const role = event.url.searchParams.get('role') ?? '';
	const major = event.url.searchParams.get('major') ?? '';
	const page = Math.max(parseInt(event.url.searchParams.get('page') || '1', 10), 1);
	const limit = Math.max(parseInt(event.url.searchParams.get('limit') || '10', 10), 1);

	try {
		const response = await api.usersList({
			headers: authHeaders(token)
		});

		const users = response.data.data ?? [];
		const majors = [...new Set(users.map((user) => user.major).filter(Boolean))].sort() as string[];

		return {
			users,
			allUsersCount: users.length,
			majors,
			filters: { q, role, major, page, limit }
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			return {
				users: [],
				allUsersCount: 0,
				majors: [],
				filters: { q, role, major, page: 1, limit },
				error: error.response?.data?.error ?? 'Gagal memuat daftar pengguna'
			};
		}

		throw error;
	}
};

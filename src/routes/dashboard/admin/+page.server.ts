import { api } from '$lib/api/client';
import { authHeaders, requireAdmin } from '$lib/utils/auth';
import type { PageServerLoad } from './$types';
import { AxiosError } from 'axios';

const emptyMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };

export const load: PageServerLoad = async (event) => {
	const { token } = requireAdmin(event);

	const q = event.url.searchParams.get('q')?.trim().toLowerCase() ?? '';
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

		const filteredUsers = users.filter((user) => {
			if (q) {
				const haystack = `${user.name ?? ''} ${user.email ?? ''}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			if (role && user.role !== role) return false;
			if (major && user.major !== major) return false;
			return true;
		});

		const total = filteredUsers.length;
		const totalPages = Math.max(Math.ceil(total / limit), 1);
		const currentPage = Math.min(page, totalPages);
		const offset = (currentPage - 1) * limit;
		const paginatedUsers = filteredUsers.slice(offset, offset + limit);

		return {
			users: paginatedUsers,
			allUsersCount: users.length,
			meta: {
				total,
				page: currentPage,
				limit,
				totalPages: total > 0 ? totalPages : 0
			},
			majors,
			filters: { q, role, major, page: currentPage, limit }
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			return {
				users: [],
				allUsersCount: 0,
				meta: emptyMeta,
				majors: [],
				filters: { q, role, major, page: 1, limit },
				error: error.response?.data?.error ?? 'Gagal memuat daftar pengguna'
			};
		}

		throw error;
	}
};

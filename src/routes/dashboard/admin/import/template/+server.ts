import { USER_IMPORT_TEMPLATE_CSV } from '$lib/constants/user-import-template';
import { requireAdmin } from '$lib/utils/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	return new Response(USER_IMPORT_TEMPLATE_CSV, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="template-import-pengguna.csv"'
		}
	});
};

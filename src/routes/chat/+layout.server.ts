import { requireAuth } from '$lib/utils/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { user, token } = requireAuth(event);

	return { user, token };
};

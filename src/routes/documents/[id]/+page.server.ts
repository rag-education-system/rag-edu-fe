import { api } from '$lib/api/client';
import { authHeaders, redirectToLogin, requireAuth } from '$lib/utils/auth';
import { updateDocumentVisibilitySchema } from '$lib/zod4_schema/document';
import type { Actions, PageServerLoad } from './$types';
import { AxiosError } from 'axios';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

function canEditVisibility(
	user?: { id?: string; role?: string },
	document?: { userId?: string }
) {
	if (!user?.id || !document?.userId || user.id !== document.userId) {
		return false;
	}
	return user.role === 'ADMIN' || user.role === 'TEACHER';
}

export const load: PageServerLoad = async (event) => {
	const { token, user } = requireAuth(event);
	const { id } = event.params;

	try {
		const response = await api.documentsDetail(id, {
			headers: authHeaders(token)
		});

		const document = response.data;
		const visibility =
			document.visibility === 'PUBLIC' || document.visibility === 'PRIVATE'
				? document.visibility
				: 'PRIVATE';

		return {
			document,
			user,
			canEditVisibility: canEditVisibility(user, document),
			visibilityForm: await superValidate({ visibility }, zod4(updateDocumentVisibilitySchema))
		};
	} catch (err) {
		if (err instanceof AxiosError) {
			if (err.response?.status === 401) {
				redirectToLogin(event);
			}

			if (err.response?.status === 404) {
				error(404, 'Dokumen tidak ditemukan');
			}
		}

		error(500, 'Gagal memuat detail dokumen');
	}
};

export const actions: Actions = {
	updateVisibility: async (event) => {
		const { token, user } = requireAuth(event);
		const { id } = event.params;
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod4(updateDocumentVisibilitySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const detail = await api.documentsDetail(id, {
				headers: authHeaders(token)
			});

			if (!canEditVisibility(user, detail.data)) {
				return fail(403, {
					form,
					error: 'Anda tidak dapat mengubah visibilitas dokumen ini'
				});
			}

			await api.documentsVisibilityUpdate(
				id,
				{ visibility: form.data.visibility },
				{ headers: authHeaders(token) }
			);

			return { form, success: true };
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					redirectToLogin(event);
				}

				return fail(err.response?.status ?? 400, {
					form,
					error: err.response?.data?.error ?? 'Gagal memperbarui visibilitas'
				});
			}

			return fail(500, { form, error: 'Terjadi kesalahan server' });
		}
	},
	reprocess: async (event) => {
		const { token } = requireAuth(event);
		const { id } = event.params;

		try {
			await api.documentsReprocess(id, {
				headers: authHeaders(token)
			});

			return { success: true };
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					redirectToLogin(event);
				}

				return fail(400, {
					error: err.response?.data?.error ?? 'Gagal memproses ulang dokumen'
				});
			}

			return fail(500, { error: 'Terjadi kesalahan server' });
		}
	},
	delete: async (event) => {
		const { token } = requireAuth(event);
		const { id } = event.params;

		try {
			await api.documentsDelete(id, {
				headers: authHeaders(token)
			});

			throw redirect(303, '/documents');
		} catch (err) {
			if (isRedirect(err)) {
				throw err;
			}

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					redirectToLogin(event);
				}

				return fail(400, {
					error: err.response?.data?.error ?? 'Gagal menghapus dokumen'
				});
			}

			return fail(500, { error: 'Terjadi kesalahan server' });
		}
	}
};

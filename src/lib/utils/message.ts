import { fail } from '@sveltejs/kit';
import { AxiosError, type AxiosResponse } from 'axios';
import { toast } from 'svelte-sonner';
import type { SuperValidated } from 'sveltekit-superforms';
import type { SuperFormData } from 'sveltekit-superforms/client';

export function getMessageAxios(m: unknown) {
	function showErrorToastAxios(err: unknown) {
		toast.error(err instanceof AxiosError ? err?.response?.data?.error : 'Terjadi kesalahan');
	}

	function showSuccessToastAxios(data: AxiosResponse) {
		toast.success(data?.data?.message || 'Berhasil', {
			duration: 3000
		});
	}

	return {
		error: () => showErrorToastAxios(m),
		success: () => showSuccessToastAxios(m as AxiosResponse)
	};
}

export function getMessageForm<T extends Record<string, unknown>>(
	form: SuperValidated<T, { error: boolean; message: string }>,
	formData: SuperFormData<T>
): boolean {
	if (form.valid === false) {
		formData.set(form.data);
		toast.error(form.message?.message ?? 'Terjadi kesalahan', { duration: 5000 });
		return false;
	}

	toast.success(form.message?.message ?? 'Berhasil', { duration: 5000 });
	return true;
}

export function getMessageFormError<T extends Record<string, unknown>>(
	form: SuperValidated<T>,
	res: { error?: string; message?: string; errors?: Record<string, unknown> } | undefined
) {
	const errorMessage =
		res?.error || res?.message || 'Email atau password salah';

	return fail(400, {
		form,
		message: errorMessage
	});
}

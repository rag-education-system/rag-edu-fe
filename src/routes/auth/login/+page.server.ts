import { api } from '$lib/api/client';
import { setCookieWithDefaults } from '$lib/utils/cookie';
import { loginSchema } from '$lib/zod4_schema/auth';
import { mapApiLoginError, type LoginFeedback } from '$lib/utils/login-feedback';
import { AxiosError } from 'axios';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
  if (event.locals.token) {
    const redirectTo = event.url.searchParams.get('redirect') || '/dashboard';
    throw redirect(303, redirectTo);
  }

  const form = await superValidate(zod4(loginSchema));
  const info = event.url.searchParams.get('info');
  const redirectTo = event.url.searchParams.get('redirect');

  return {
    form,
    info,
    redirectTo
  };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const form = await superValidate(formData, zod4(loginSchema));

    if (!form.valid) {
      const message: LoginFeedback = {
        kind: 'error',
        title: 'Form belum valid',
        description: 'Periksa email dan password, lalu coba kirim lagi.'
      };
      return fail(400, { form, message });
    }

    try {
      const response = await api.authLoginCreate(form.data);
      const { token, user } = response.data;

      if (!token || !user) {
        const message = mapApiLoginError(undefined, 401);
        return fail(401, { form, message });
      }

      setCookieWithDefaults(event.cookies, 'auth_token', token);
      setCookieWithDefaults(event.cookies, 'user', JSON.stringify(user));
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        const apiError =
          (err.response?.data as { error?: string; message?: string } | undefined)?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)?.message;

        if (!err.response) {
          const message: LoginFeedback = {
            kind: 'error',
            title: 'Tidak dapat terhubung ke server',
            description:
              'Periksa koneksi internet Anda atau pastikan layanan backend sedang berjalan.'
          };
          return fail(503, { form, message });
        }

        const message = mapApiLoginError(apiError, status);
        return fail(status ?? 400, { form, message });
      }

      const message: LoginFeedback = {
        kind: 'error',
        title: 'Terjadi kesalahan server',
        description: 'Silakan coba lagi dalam beberapa saat.'
      };
      return fail(500, { form, message });
    }

    const redirectTo = event.url.searchParams.get('redirect') || '/dashboard';
    throw redirect(303, redirectTo);
  }
};

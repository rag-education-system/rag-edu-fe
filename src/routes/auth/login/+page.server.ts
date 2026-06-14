import { api } from '$lib/api/client';
import { setCookieWithDefaults } from '$lib/utils/cookie';
import { loginSchema } from '$lib/zod4_schema/auth';
import { AxiosError } from 'axios';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getMessageFormError } from '$lib/utils/message';

export const load: PageServerLoad = async (event) => {
  if (event.locals.token) {
    const redirectTo = event.url.searchParams.get('redirect') || '/dashboard';
    throw redirect(303, redirectTo);
  }

  const form = await superValidate(zod4(loginSchema));
  const info = event.url.searchParams.get('info');

  return {
    form,
    info
  };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const form = await superValidate(formData, zod4(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await api.authLoginCreate(form.data);
      const { token, user } = response.data;

      if (!token || !user) {
        return fail(401, { form, message: 'Email atau password salah' });
      }

      setCookieWithDefaults(event.cookies, 'auth_token', token);
      setCookieWithDefaults(event.cookies, 'user', JSON.stringify(user));

      const redirectTo = event.url.searchParams.get('redirect') || '/dashboard';
      throw redirect(303, redirectTo);
    } catch (err) {
      if (err instanceof Response) {
        throw err;
      }

      if (err instanceof AxiosError) {
        return getMessageFormError(form, err.response?.data);
      }

      return fail(500, { form, message: 'Terjadi kesalahan server' });
    }
  }
};

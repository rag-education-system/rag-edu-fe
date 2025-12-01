
import { api } from '$lib/api/client';
import { setCookieWithDefaults } from '$lib/utils/cookie';
import { loginSchema } from '$lib/zod4_schema/auth';
import { AxiosError } from 'axios';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getMessageFormError } from '$lib/utils/message';


export const load: PageServerLoad = async (event) => {
  // redirect if already logged in
  if(event.locals.token){
    const redirectTo = event.url.searchParams.get('redirect') || '/';
    throw redirect(303, redirectTo);
  }


  // initial data
  const form = await superValidate(zod4(loginSchema));
  return {form};
} 



export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const form = await superValidate(formData, zod4(loginSchema));  

    // validate form
    if(!form.valid){
      return fail(400, {form});
    }


    //  api call to login
    const res = await api.authControllerLogin(form.data).
    then((res)=> {
      setCookieWithDefaults(event.cookies, 'auth_token', res.data.access_token);
      return res.data;
    }).
    catch((err)=> {
      if(err instanceof AxiosError){
        return err.response?.data;
      }
    });


    if(!res?.error){
      const user = await api
      .usersControllerGetCurrentUser({
        headers: { Authorization: `Bearer ${res.token}` }
      })
      .then((res)=> {
        return res.data;
      })
      .catch((err)=> {
        if(err instanceof AxiosError){
          return err.response?.data;
        }
      })
    }

    if(res.err){
      return getMessageFormError(form, res)
    }
    throw redirect(302, '/');

}


}


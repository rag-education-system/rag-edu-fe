import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { registerSchema } from "$lib/zod4_schema/auth";
import { zod4 } from "sveltekit-superforms/adapters";
import { api } from "$lib/api/client";
import { AxiosError } from "axios";
import { getMessageFormError } from "$lib/utils/message";




export const load: PageServerLoad = async(event)=> {

  if(event.locals.token){
    const redirectTo = event.url.searchParams.get('redirect') || '/';
    throw redirect(303, redirectTo);
  }

  return {
    form:  await superValidate(zod4(registerSchema))
  }


}


export const actions: Actions = {
  default: async(event)=> {
    const formData = await event.request.formData();
    const form = await superValidate(formData, zod4(registerSchema));

    // LOG: Data yang diterima
    // console.log('[REGISTER] Form submitted:', {
    //   email: form.data.email,
    //   name: form.data.name,
    //   major: form.data.major,
    //   hasPassword: !!form.data.password
    // });

    if(!form.valid){
      // LOG: Frontend validation gagal
      // console.error('[REGISTER] Frontend validation failed:', form.errors);
      return fail(400, {form}); 
    }

    // LOG: Frontend validation sukses
    // console.log('[REGISTER] Frontend validation passed. Calling backend API...');

    try {
      const res = await api.authControllerRegister({
        email: form.data.email,
        password: form.data.password,
        name: form.data.name,
        major: form.data.major
      });

      // LOG: Backend sukses
      // console.log('[REGISTER] Backend API success:', {
      //   status: res.status,
      //   userId: res.data.id
      // });

      // Proper server-side redirect
      throw redirect(303, '/auth/login');

    } catch(err) {
      if(err instanceof AxiosError){
        // LOG: Backend error
        // console.error('[REGISTER] Backend API error:', {
        //   status: err.response?.status,
        //   data: err.response?.data
        // });

        return getMessageFormError(form, err.response?.data);
      }

      // Re-throw redirect (dari success case)
      throw err;
    }
  }
}




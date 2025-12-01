import { api } from "$lib/api/client";
import { setCookieWithDefaults } from "$lib/utils/cookie";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const getToken: Handle = async ({event, resolve})=> {
  // Get auth token from cookies
  const token  = event.cookies.get("auth_token");
  event.locals.token = token ?? null;
  const user = event.cookies.get("user");

  event.locals.user = user ? JSON.parse(user) : undefined;
  const response = await resolve(event);
  return response;
}



export const user: Handle = async ({event, resolve})=> {

  const token = event.cookies.get("auth_token");
  const user = event.cookies.get("user");

  if(!token){
    return await resolve(event);
  }

  if(user){
    event.locals.user = JSON.parse(user);
  }else{
    const response = await api.usersControllerGetCurrentUser({
      headers: {Authorization: `Bearer ${token}`}
    })


    const user = JSON.stringify(response.data);

    setCookieWithDefaults(event.cookies, 'user', user);
    event.locals.user = JSON.parse(user);

  }

  return await resolve(event);

}

export const handle = sequence(getToken, user)













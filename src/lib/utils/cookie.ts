import { dev } from "$app/environment";
import type { Cookies } from "@sveltejs/kit";



export function setCookieWithDefaults(
      cookies: Cookies,
      name: string,
      value: string,
      options?: {
            maxAge?: number;
            expires?: Date;
      }
){
  const defaultMaxAge = 60 * 60 * 24 * 7; // 7 days
  cookies.set(name, value, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: !dev, // secure in production only
            maxAge: options?.maxAge ?? defaultMaxAge,
            ...(options?.expires && { expires: options.expires })
      });
}



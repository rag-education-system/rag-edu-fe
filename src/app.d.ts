// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DtoUserInfo } from '$lib/api/api';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: number;
		}
		interface Locals {
			user: DtoUserInfo | undefined;
			token: string | null;
		}
	}
}

export {};

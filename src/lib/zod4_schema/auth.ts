import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({ error: 'Email wajib diisi' })
		.min(1, 'Email wajib diisi')
		.email('Format email tidak valid. Contoh: nama@kampus.ac.id'),
	password: z
		.string({ error: 'Password wajib diisi' })
		.min(1, 'Password wajib diisi')
		.min(5, 'Password minimal 5 karakter')
});

export type LoginFormSchema = typeof loginSchema;

export const registerSchema = z.object({
	email: z.string().email('Format email tidak valid'),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	password: z.string().min(5, 'Password minimal 5 karakter'),
	major: z.string().min(2, 'Jurusan minimal 2 karakter')
});

export type RegisterFormSchema = typeof registerSchema;

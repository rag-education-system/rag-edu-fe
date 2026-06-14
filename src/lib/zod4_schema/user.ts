import { z } from 'zod';

export const createUserSchema = z.object({
	email: z.string().email('Email tidak valid'),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	password: z.string().min(5, 'Password minimal 5 karakter'),
	major: z.string().min(2, 'Jurusan minimal 2 karakter'),
	role: z.enum(['STUDENT', 'TEACHER'])
});

export const updateUserSchema = z.object({
	email: z.string().email('Email tidak valid'),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	password: z
		.string()
		.refine((val) => val === '' || val.length >= 5, 'Password minimal 5 karakter'),
	major: z.string().min(2, 'Jurusan minimal 2 karakter'),
	role: z.enum(['STUDENT', 'TEACHER'])
});

export type CreateUserFormSchema = typeof createUserSchema;
export type UpdateUserFormSchema = typeof updateUserSchema;

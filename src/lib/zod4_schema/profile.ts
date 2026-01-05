import type { UpdateUserDto } from '$lib/api/api';
import { z } from 'zod';

export const updateProfileSchema = z.object({
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Email tidak valid'),
	major: z.string().min(2, 'Jurusan minimal 2 karakter'),
	password: z
		.string()
		.min(5, 'Password minimal 5 karakter')
		.optional()
		.or(z.literal(''))
}) satisfies z.ZodType<Omit<UpdateUserDto, 'role'>>;

export type UpdateProfileSchema = typeof updateProfileSchema;

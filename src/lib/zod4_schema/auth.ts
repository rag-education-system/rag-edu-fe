import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(5, 'Password must be at least 5 characters')
});

export type LoginFormSchema = typeof loginSchema;

export const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	password: z.string().min(5, 'Password must be at least 5 characters'),
	major: z.string().min(2, 'Major must be at least 2 characters')
});

export type RegisterFormSchema = typeof registerSchema;

import { z } from 'zod';

export const uploadDocumentSchema = z.object({
	visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE')
});

export const updateDocumentVisibilitySchema = z.object({
	visibility: z.enum(['PUBLIC', 'PRIVATE'])
});

export type UploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;
export type UpdateDocumentVisibilitySchema = z.infer<typeof updateDocumentVisibilitySchema>;

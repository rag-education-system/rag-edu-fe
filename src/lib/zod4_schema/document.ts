import { z } from 'zod';

export const uploadDocumentSchema = z.object({
	visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE')
});

export type UploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;

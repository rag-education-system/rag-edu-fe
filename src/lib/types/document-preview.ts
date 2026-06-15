import type { DocumentItemDto } from '$lib/types/api';

export interface SourcePreviewSelection {
	documentId: string;
	pageNumber?: number;
	similarity?: number;
	snippet?: string;
}

export type DocumentPreviewDocument = DocumentItemDto;

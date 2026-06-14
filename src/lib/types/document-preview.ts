import type { DocumentItemDto } from '$lib/types/api';

export interface DocumentChunkPreview {
	chunkIndex: number;
	content: string;
}

export interface DocumentPreviewData {
	document: DocumentItemDto;
	chunks: DocumentChunkPreview[];
}

export interface SourcePreviewSelection {
	documentId: string;
	chunkIndex: number;
	similarity?: number;
	snippet?: string;
}

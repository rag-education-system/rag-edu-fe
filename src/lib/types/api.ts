import type { DtoChunkSource, DtoDocumentInfo, DtoUserInfo } from '$lib/api/api';

export type DocumentItemDto = DtoDocumentInfo;
export type QuerySourceDto = DtoChunkSource;
export type UserInfo = DtoUserInfo;

export type DocumentStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type DocumentVisibility = 'PUBLIC' | 'PRIVATE';

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
	PROCESSING: 'Memproses',
	COMPLETED: 'Selesai',
	FAILED: 'Gagal'
};

export const DOCUMENT_STATUS_VARIANTS = {
	PROCESSING: 'secondary',
	COMPLETED: 'default',
	FAILED: 'destructive'
} as const;

export const DOCUMENT_VISIBILITY_LABELS: Record<DocumentVisibility, string> = {
	PUBLIC: 'Publik',
	PRIVATE: 'Privat'
};

export function isDocumentStatus(value?: string): value is DocumentStatus {
	return value === 'PROCESSING' || value === 'COMPLETED' || value === 'FAILED';
}

export function isDocumentVisibility(value?: string): value is DocumentVisibility {
	return value === 'PUBLIC' || value === 'PRIVATE';
}

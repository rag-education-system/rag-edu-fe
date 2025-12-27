import type { DocumentItemDto } from '$lib/api/api';

export interface DashboardStatistics {
	totalDocuments: number;
	processing: number;
	completed: number;
	failed: number;
	totalStorage: number;
	recentActivity: number;
}

export interface DashboardData {
	user: any;
	documents: DocumentItemDto[];
	meta: { total: number; page: number; limit: number; totalPages: number };
	statistics: DashboardStatistics;
	error?: string;
}

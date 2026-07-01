export function getRoleLabel(role?: string): string {
	switch (role) {
		case 'ADMIN':
			return 'Admin';
		case 'TEACHER':
			return 'Dosen';
		case 'STUDENT':
			return 'Mahasiswa';
		default:
			return 'Mahasiswa';
	}
}

export function formatUploaderName(
	document: { userId?: string; uploaderName?: string },
	currentUserId?: string
): string {
	if (document.userId && currentUserId && document.userId === currentUserId) {
		return 'Anda';
	}

	return document.uploaderName?.trim() || 'Pengguna';
}

export function getRoleBadgeVariant(
	role?: string
): 'destructive' | 'secondary' | 'outline' {
	switch (role) {
		case 'ADMIN':
			return 'destructive';
		case 'TEACHER':
			return 'secondary';
		default:
			return 'outline';
	}
}

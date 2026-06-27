export type LoginFeedbackKind = 'error' | 'success' | 'info' | 'warning';

export type LoginFeedback = {
	kind: LoginFeedbackKind;
	title: string;
	description?: string;
};

export function mapApiLoginError(
	error: string | undefined,
	status?: number
): LoginFeedback {
	const normalized = (error ?? '').trim().toLowerCase();

	if (status === 429 || normalized.includes('terlalu banyak')) {
		return {
			kind: 'warning',
			title: 'Terlalu banyak percobaan login',
			description:
				'Akun Anda sementara dibatasi demi keamanan. Tunggu beberapa menit, lalu coba lagi.'
		};
	}

	if (
		status === 401 ||
		normalized.includes('invalid credentials') ||
		normalized.includes('email atau password salah')
	) {
		return {
			kind: 'error',
			title: 'Email atau password salah',
			description:
				'Pastikan email terdaftar dan password benar. Periksa huruf besar/kecil pada password.'
		};
	}

	if (normalized.includes('email and password are required')) {
		return {
			kind: 'error',
			title: 'Data login belum lengkap',
			description: 'Email dan password wajib diisi sebelum masuk.'
		};
	}

	if (status === 500 || normalized.includes('internal')) {
		return {
			kind: 'error',
			title: 'Server sedang bermasalah',
			description: 'Tim kami sedang menangani gangguan. Silakan coba lagi dalam beberapa saat.'
		};
	}

	return {
		kind: 'error',
		title: 'Login gagal',
		description: error?.trim() || 'Terjadi kesalahan saat masuk. Silakan coba lagi.'
	};
}

export function resolveLoginInfo(
	info: string | null,
	redirect: string | null
): LoginFeedback | null {
	switch (info) {
		case 'contact-admin':
			return {
				kind: 'info',
				title: 'Akun dibuat oleh administrator',
				description:
					'Pendaftaran mandiri tidak tersedia. Hubungi administrator kampus untuk membuat akun mahasiswa atau dosen.'
			};
		case 'logged-out':
			return {
				kind: 'success',
				title: 'Anda telah keluar',
				description: 'Sesi berhasil diakhiri. Masuk kembali untuk melanjutkan.'
			};
		case 'session-expired':
			return {
				kind: 'warning',
				title: 'Sesi Anda telah berakhir',
				description: 'Silakan masuk kembali untuk melanjutkan aktivitas Anda.'
			};
		case 'required':
			return {
				kind: 'info',
				title: 'Login diperlukan',
				description: redirect
					? `Masuk terlebih dahulu untuk mengakses halaman yang Anda tuju.`
					: 'Masuk dengan akun kampus Anda untuk melanjutkan.'
			};
		default:
			return null;
	}
}

export function resolveRedirectHint(redirect: string | null): string | null {
	if (!redirect || redirect === '/dashboard') return null;

	const labels: Record<string, string> = {
		'/chat': 'Tanya AI',
		'/documents': 'Dokumen',
		'/documents/upload': 'Unggah Dokumen',
		'/dashboard/profile': 'Profil',
		'/dashboard/admin': 'Kelola Pengguna'
	};

	const label = labels[redirect] ?? redirect;
	return `Setelah login berhasil, Anda akan diarahkan ke ${label}.`;
}

export function isLoginFeedback(value: unknown): value is LoginFeedback {
	if (!value || typeof value !== 'object') return false;
	const candidate = value as LoginFeedback;
	return (
		typeof candidate.title === 'string' &&
		['error', 'success', 'info', 'warning'].includes(candidate.kind)
	);
}

type Bucket = {
	count: number;
	resetAt: number;
};

const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
	if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
	lastCleanup = now;

	for (const [key, bucket] of buckets) {
		if (now > bucket.resetAt) {
			buckets.delete(key);
		}
	}
}

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
	const now = Date.now();
	cleanup(now);

	const bucket = buckets.get(key);
	if (!bucket || now > bucket.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}

	if (bucket.count >= max) {
		return false;
	}

	bucket.count += 1;
	return true;
}

export function rateLimitKey(ip: string, path: string) {
	return `${ip}:${path}`;
}

export const FE_RATE_LIMITS = {
	global: { max: 300, windowMs: 60_000 },
	/** POST login — cegah spam login dari IP/akun yang sama */
	login: { max: 15, windowMs: 15 * 60_000 },
	/** POST logout — lebih longgar agar tidak mengunci pengguna normal */
	logout: { max: 40, windowMs: 60_000 },
	api: { max: 120, windowMs: 60_000 }
} as const;

export function resolveFrontendLimit(pathname: string, method: string) {
	if (method === 'POST' && pathname.startsWith('/auth/login')) {
		return FE_RATE_LIMITS.login;
	}
	if (method === 'POST' && pathname === '/api/auth/logout') {
		return FE_RATE_LIMITS.logout;
	}
	if (pathname.startsWith('/api/')) {
		return FE_RATE_LIMITS.api;
	}
	return FE_RATE_LIMITS.global;
}

/** Paths that should not count toward rate limits (assets, prefetch noise). */
export function shouldSkipRateLimit(pathname: string, method: string): boolean {
	if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
		return true;
	}
	if (pathname.startsWith('/_app/') || pathname.startsWith('/favicon')) {
		return true;
	}
	return false;
}

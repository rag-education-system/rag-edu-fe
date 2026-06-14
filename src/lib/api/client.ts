import { Api } from './api';
import { dev } from '$app/environment';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ApiClient = () => {
	const instance = new Api({
		baseURL: API_BASE_URL,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (dev) {
		instance.instance.interceptors.request.use((config) => {
			console.log('[API REQUEST]', {
				method: config.method?.toUpperCase(),
				url: config.url
			});
			return config;
		});

		instance.instance.interceptors.response.use(
			(response) => {
				console.log('[API RESPONSE SUCCESS]', {
					status: response.status,
					url: response.config.url
				});
				return response;
			},
			(error) => {
				console.error('[API RESPONSE ERROR]', {
					status: error.response?.status,
					url: error.config?.url,
					data: error.response?.data
				});
				return Promise.reject(error);
			}
		);
	}

	return instance.api;
};

export const api = ApiClient();

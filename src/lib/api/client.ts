import { Api } from "./api";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

console.log('[API CLIENT] Initialized with URL:', API_BASE_URL);

const ApiClient = ()=> {
  const instance = new Api({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Request interceptor
  instance.instance.interceptors.request.use(
    (config) => {
      console.log('[API REQUEST]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data
      });
      return config;
    }
  );

  // Response interceptor
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

  return instance.api;
};

export const api = ApiClient();
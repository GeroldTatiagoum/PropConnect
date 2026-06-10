import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createLogger } from '@/utils/logger';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _startTime?: number;
    _retry?: boolean;
  }
}

const logger = createLogger('API');
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config._startTime = Date.now();

  logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    hasBody: !!config.data,
  });

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const durationMs = response.config._startTime ? Date.now() - response.config._startTime : -1;
    const { status, config } = response;

    if (status >= 400) {
      logger.warn(`← ${config.method?.toUpperCase()} ${config.url} ${status} +${durationMs}ms`);
    } else {
      logger.info(`← ${config.method?.toUpperCase()} ${config.url} ${status} +${durationMs}ms`);
    }

    return response;
  },
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig;
    const durationMs = original?._startTime ? Date.now() - original._startTime : -1;
    const status: number | undefined = error.response?.status;
    const method = original?.method?.toUpperCase() ?? '?';
    const url = original?.url ?? '?';

    if (status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        logger.debug(`→ token refresh attempt for ${method} ${url}`);
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          original.headers!.Authorization = `Bearer ${data.accessToken}`;
          logger.info(`token refresh success, retrying ${method} ${url}`);
          return api(original);
        } catch (refreshErr) {
          logger.warn('token refresh failed — redirecting to login', refreshErr);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    logger.error(`← ${method} ${url} ${status ?? 'NETWORK_ERROR'} +${durationMs}ms`, {
      message: error.response?.data?.error?.message ?? error.message,
      code: error.response?.data?.error?.code,
      details: error.response?.data?.error?.details,
    });

    return Promise.reject(error);
  },
);

export default api;

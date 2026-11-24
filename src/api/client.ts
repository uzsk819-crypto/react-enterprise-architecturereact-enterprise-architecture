import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env.config';
import { useAuthStore } from '../store/authStore';
import { ApiError } from './apiError';

/**
 * Central Axios Instance with environment-based configuration.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor: Injects auth token, sets correlation IDs.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    // Add request timestamp or tracing header if needed
    config.headers['X-Client-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(
      new ApiError(error.message || 'Request configuration error', 400, error)
    );
  }
);

/**
 * Response Interceptor: Standardizes responses and maps error payloads into ApiError.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (axios.isCancel(error)) {
      return Promise.reject(new ApiError('Request was cancelled', 499, null, false));
    }

    if (!error.response) {
      // Network failure, offline, CORS, or DNS error
      return Promise.reject(
        new ApiError(
          error.message || 'Network error: please check your internet connection.',
          0,
          null,
          true
        )
      );
    }

    const { status, data } = error.response;
    const responseData = data as Record<string, unknown> | undefined;
    const errorMessage =
      (responseData?.message as string) ||
      (responseData?.error as string) ||
      `HTTP Error ${status}: ${error.response.statusText}`;

    // Handle Unauthorized / Session Expiration
    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new ApiError(errorMessage, status, responseData));
  }
);

/**
 * Strongly typed HTTP helper functions supporting AbortSignal cancellation.
 */
export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, body, config);
    return response.data;
  },

  put: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<T>(url, body, config);
    return response.data;
  },

  patch: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<T>(url, body, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

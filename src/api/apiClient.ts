import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  AUTH_EXPIRED_EVENT,
  StorageKeys,
  ErrorCodes,
} from '../constants/api';
import type { ApiErrorResponse, SerializedError } from '../types';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: REQUEST_TIMEOUT,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(StorageKeys.TOKEN);
      localStorage.removeItem(StorageKeys.USER);
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export function normalizeError(error: unknown): SerializedError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;

    if (!axiosErr.response) {
      if (axiosErr.code === 'ECONNABORTED') {
        return {
          code: ErrorCodes.TIMEOUT_ERROR,
          message: 'Request timed out. Please try again.',
          statusCode: 0,
        };
      }
      return {
        code: ErrorCodes.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      };
    }

    const data = axiosErr.response.data;
    if (data?.error) {
      return {
        code: data.error.code,
        message: data.error.message,
        details: data.error.details,
        statusCode: axiosErr.response.status,
      };
    }

    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: `Request failed with status ${axiosErr.response.status}`,
      statusCode: axiosErr.response.status,
    };
  }

  return {
    code: ErrorCodes.UNKNOWN_ERROR,
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}

export default apiClient;

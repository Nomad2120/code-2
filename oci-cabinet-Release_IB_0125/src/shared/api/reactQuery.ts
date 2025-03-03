import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { CORE_PATH } from '@shared/api/paths';
import notistack from '@shared/utils/helpers/notistackExternal';
import { authModule } from '@mobx/root';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5
    }
  }
});

const apiUrl = process.env.VITE_REACT_APP_API_URL;

export const AXIOS_INSTANCE = axios.create({
  baseURL: `${apiUrl}/core`,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (config.url?.indexOf(`${CORE_PATH}/Auth`) !== 0) {
    const token = localStorage.getItem('token') || '';

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    const { data } = response;

    try {
      const { result } = data;
      if (response.config.url?.indexOf(`${CORE_PATH}/Auth`) === 0 && result && result.token) {
        const { token } = result;
        localStorage.setItem('token', token);
      }
    } catch (err) {
      console.error(err);
    }

    return data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      notistack.warning('Сессия истекла');

      authModule.sessionExpired();

      return;
    }
    if (error?.response?.status === 400 && error?.response?.data?.errors) {
      error.message = Object.entries(error.response.data.errors).reduce(
        (acc, [key, value], index) =>
          `${acc}${index > 0 ? ';' : ''}${key}: ${Array.isArray(value) ? value.join(',') : JSON.stringify(value)}`,
        error.response.data?.title || ''
      );
    }
    throw error;
  }
);

export const axiosForReactQueryInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise as Promise<T>;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

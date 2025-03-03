import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import notistack from '@shared/utils/helpers/notistackExternal';
import { authModule } from '@mobx/root';
import { CORE_PATH } from '@shared/api/paths';

const apiUrl = process.env.VITE_REACT_APP_API_URL;

export const instance = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

let token = localStorage.getItem('token') || '';

instance.interceptors.request.use((config) => {
  if (config.url?.indexOf(`${CORE_PATH}/Auth`) !== 0) {
    config.headers.Authorization = `Bearer ${token || localStorage.getItem('token')}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { code, message, result } = data;
    if (!code && !message && !result) {
      return data;
    }
    if (code !== 0) throw message;

    try {
      if (response.config.url?.indexOf(`${CORE_PATH}/Auth`) === 0 && result && result.token) {
        token = result.token;
        localStorage.setItem('token', token);
      }
    } catch (err) {
      console.error(err);
    }
    return result;
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

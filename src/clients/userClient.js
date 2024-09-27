import axios from 'axios';
import {store} from '../store/store';
import {refreshToken} from './userService';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/',
});

const isTokenExpired = expiresIn => {
  const currentTime = Math.floor(Date.now() / 1000);
  return expiresIn && currentTime >= expiresIn;
};

instance.interceptors.request.use(
  async config => {
    const state = store.getState().auth;
    const token = state.accessToken;
    const expiresIn = state.expiresIn;

    if (token) {
      if (expiresIn && isTokenExpired(expiresIn)) {
        // Check if token and expiresIn are defined
        const refreshTokenValue = state.refreshToken;

        if (refreshTokenValue) {
          const success = await refreshToken(store.dispatch, refreshTokenValue);

          if (success) {
            const newState = store.getState().auth;
            config.headers.Authorization = `Bearer ${newState.accessToken}`;
          } else {
            return Promise.reject(new Error('Token refresh failed'));
          }
        } else {
          return Promise.reject(new Error('No refresh token available'));
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.error('Actual Error:', error);

    console.error('Request:', JSON.stringify(originalRequest));

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState().auth;
      const refreshTokenValue = state.refreshToken;

      if (refreshTokenValue) {
        const success = await refreshToken(store.dispatch, refreshTokenValue);

        if (success) {
          return instance(originalRequest);
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default instance;

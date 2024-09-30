import axios from 'axios';
import {store} from '../store/store';
import {refreshToken} from './userService';

const createAxiosWithAuth = baseURL => {
  const instance = axios.create({
    baseURL,
  });

  let isRefreshing = false;
  let failedQueue = [];
  let retryCount = 0;
  const MAX_RETRY = 3;
  const INITIAL_BACKOFF = 1000; // 1 second

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  instance.interceptors.request.use(
    async config => {
      const state = store.getState().auth;
      const token = state.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const backoff = attempt => INITIAL_BACKOFF * Math.pow(2, attempt);

        return new Promise((resolve, reject) => {
          const attemptRefresh = async () => {
            try {
              const state = store.getState().auth;
              const refreshTokenValue = state.refreshToken;
              const refreshSuccess = await refreshToken(store.dispatch, refreshTokenValue);

              if (refreshSuccess) {
                const newToken = store.getState().auth.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                resolve(instance(originalRequest));
              } else {
                processQueue(new Error('Failed to refresh token'), null);
                reject(error);
              }
            } catch (refreshError) {
              if (refreshError.message.includes('Rate exceeded') && retryCount < MAX_RETRY) {
                retryCount++;
                const delay = backoff(retryCount);
                console.log(`Token refresh rate exceeded. Retrying in ${delay}ms...`);
                setTimeout(attemptRefresh, delay);
              } else {
                processQueue(refreshError, null);
                reject(refreshError);
              }
            } finally {
              isRefreshing = false;
            }
          };

          attemptRefresh();
        });
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export default createAxiosWithAuth;

import store from '@/store/index';

export const setInterceptors = instance => {
  // Add a request interceptor
  instance.interceptors.request.use(
    config => {
      config.headers.Authorization = store.state.apiKey;
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    },
  );
  return instance;
};

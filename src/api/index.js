import axios from 'axios';
import { setInterceptors } from '@/api/interceptors';

const createInstance = () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  });
};

const createInstanceWithAuth = () => {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  });
  return setInterceptors(instance);
};

export const instance = createInstance();
export const instanceAuth = createInstanceWithAuth();

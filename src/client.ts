import { browser } from '$app/environment';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 30000,
});

if (browser) {
    const token = localStorage?.getItem('t');
    if(token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
} 

axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('t');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance    
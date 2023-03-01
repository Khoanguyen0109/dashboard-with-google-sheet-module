import axios from 'axios';
import { ACCESS_TOKEN } from '../../contants';
import { getItem, resetItem, setItem } from '../../utility/localStorageControl';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

export const axiosPublic = axios.create({
  baseURL: apiEndpoint,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
const instance = axios.create({
  baseURL: apiEndpoint,
  timeout: 30000,
  withCredentials: false,
});

const getAccessToken = () => getItem(ACCESS_TOKEN);

instance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest?.sent) {
      originalRequest.sent = true;
      const { accessToken } = await axiosPublic.post('auth/refresh-tokens');
      if (!accessToken) {
        resetItem();
        window.location.replace('/');
      }
      setItem(ACCESS_TOKEN, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return instance(originalRequest);
    }
    return Promise.reject(error);
  },
);

const { get, post, patch, delete: remove, put } = instance;
export { get, post, patch,remove, put };

import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL || '/';

const request = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

request.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
);

export default request;

export const get = (url, params = {}, config = {}) => request.get(url, { params, ...config });
export const post = (url, data = {}, config = {}) => request.post(url, data, config);
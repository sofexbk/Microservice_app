import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('user') 
            ? JSON.parse(localStorage.getItem('user')!).token 
            : null;
            
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request details
        console.log('Request:', config.method?.toUpperCase(), config.url, 'Params:', config.params, 'Data:', config.data);
        
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

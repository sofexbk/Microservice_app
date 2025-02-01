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

// // Response interceptor
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         const originalRequest = error.config;
        
//         // Handle 401 Unauthorized errors
//         if (error.response?.status === 401) {
//             // Option 1: Redirect to login
//             window.location.href = '/login';
//             // Option 2: Try to refresh token
//             // const newToken = await refreshToken();
//             // if (newToken && originalRequest) {
//             //     originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//             //     return axiosInstance(originalRequest);
//             // }
//         }
        
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;

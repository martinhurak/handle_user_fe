import axios from 'axios';
import { refreshToken, logout } from './authService';


axios.defaults.withCredentials = true;


const api = axios.create({
    baseURL: 'http://localhost:8000', // URL pre backend
    withCredentials: true,             // umožniť cookies pri požiadavkách
    headers: {
        'Content-Type': 'application/json'
    }
});



api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } else {
                logout();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
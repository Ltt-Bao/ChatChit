import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,

});

// gắn accessToken vào req 

api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

//tự động rf api khi accessToken hết hạn
let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;

    // Nếu là lỗi bị khóa tài khoản thì reject luôn, không refresh
    if (error.response?.data?.message === "Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin") {
        return Promise.reject(error);
    }
    const url = originalRequest?.url || "";
    const isAuthRoute =
        url.includes("/auth/signin") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/refresh");

    if (isAuthRoute) {
        return Promise.reject(error);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const res = await api.post("/auth/refresh");
            const newAccesToken = res.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccesToken);

            originalRequest.headers.Authorization = `Bearer ${newAccesToken}`;

            processQueue(null, newAccesToken);

            return api(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearState();
            window.location.href = '/signin';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
});

export default api;
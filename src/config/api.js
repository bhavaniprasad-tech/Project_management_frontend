import axios from "axios"

// Use relative URLs with Vite proxy during development
export const API_BASE_URL = ""

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Remove default Authorization header to prevent conflicts
// JWT will be added per request by the interceptor

// Request interceptor to add JWT token (exclude auth endpoints)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");
        const isAuthEndpoint = config.url?.includes('/auth/') || config.url?.includes('accept_invitation');
        
        console.log('API Request:', config.url, 'Token exists:', !!token, 'Is auth endpoint:', isAuthEndpoint);
        
        if (token && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Added Authorization header for:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem("jwt");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
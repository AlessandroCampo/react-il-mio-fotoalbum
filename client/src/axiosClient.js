import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

const customAxiosInstance = axios.create({
    baseURL,
    timeout: 50000
})

customAxiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('museAuthToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
})

customAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('museAuthToken');
            localStorage.removeItem('museUsername');
        }
        return Promise.reject(error);
    }
);


export default customAxiosInstance;
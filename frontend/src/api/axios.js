import axios from 'axios';

// Create an Axios instance with your backend base URL
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Make sure this matches your Django port
});

// Add a request interceptor to attach the Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
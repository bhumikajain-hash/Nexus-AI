// @ts-ignore
import axios from 'axios';

const axiosConfig = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosConfig;
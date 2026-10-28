// @ts-ignore
import axios from 'axios';

const axiosConfig = axios.create({
    // @ts-ignore
    baseURL: 'https://nexus-ai-fnu9.onrender.com' || 'http://localhost:3000', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosConfig;
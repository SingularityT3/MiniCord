import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const URL: string = import.meta.env.VITE_API_URL || "http://localhost:3000";

const minicord: AxiosInstance = axios.create({
  baseURL: URL,
  timeout: 10000, 
});

minicord.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default minicord;

import axios from "axios";

const URL = "http://localhost:3000";
const minicord = axios.create({
  baseURL: URL,
  timeout: 1000,
});


minicord.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default minicord;

// apiClient.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { API_SERVER_BASE_URL } from "./utils";

const apiClient = axios.create({
    baseURL: API_SERVER_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const raw = localStorage.getItem("userDetails");
    const token = raw ? JSON.parse(raw).access_token : null;

    if (token) {
        // ✅ Correct way in Axios v1: mutate headers
        config.headers.set("Authorization", `Bearer ${token}`);
        console.log("✅ Attaching token:", token);
    } else {
        console.warn("⚠️ No token found, sending without Authorization header");
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("🚨 Unauthorized: clearing session...");
            localStorage.removeItem("userDetails");
            window.location.href = "/login";
        } else if (error.response?.status === 500) {
            return Promise.reject({ message: "Ooop! My Bad, the server is currently unbale to respone now, Please check back soon our team are on it", status: 500 })
        }
        return Promise.reject(error);
    }
);

export default apiClient;

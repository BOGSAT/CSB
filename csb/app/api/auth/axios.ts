// app/api/auth/axios.ts
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:5001`,
  withCredentials: true,
});

// Only add the interceptors on the client-side
if (typeof window !== "undefined") {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Response error:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Only clear and redirect if not on a protected route
            if (!window.location.pathname.includes("/profile")) {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              window.location.href = "/login";
              toast.error("Session expired. Please login again.");
            }
            break;
          case 403:
            toast.error("You don't have permission to perform this action");
            break;
          case 404:
            toast.error("Resource not found");
            break;
          case 500:
            toast.error("Server error. Please try again later");
            break;
          default:
            toast.error(error.response.data?.message || "An error occurred");
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }

      return Promise.reject(error);
    }
  );
}

export default api;

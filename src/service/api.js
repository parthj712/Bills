import axios from "axios";

const API = axios.create({
  baseURL: "https://billing-web-app-sdr9.onrender.com/api",
  // withCredentials: true,
});

// ⬇️ Add this to send token with ALL protected requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 Token expired or invalid

      localStorage.removeItem("token");

      // Optional: clear other data
      localStorage.removeItem("user");

      // Show message (you can replace with snackbar)
      alert("Session expired. Please login again.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
export default API;

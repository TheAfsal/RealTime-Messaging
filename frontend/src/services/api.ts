import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: false,
});

// Request Interceptor
// api.interceptors.request.use(
//   (config) => {
//     // console.log("Request intercepted:", config.url, config.params);
//     // return config;
//   },
//   (error) => {
//     // Handle request errors
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.message);
    if (error.response) {
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

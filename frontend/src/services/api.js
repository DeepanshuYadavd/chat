import axios from 'axios';

// Configure Axios with baseURL pointing to backend API (port 5000)
// and credentials enabled to allow cookie transmission.
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We can add headers or logs here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If a request fails with 401 UnAuthorized, it indicates session expiration.
    // In this case, we could clear local storage, but we leave handling to AuthContext
    // or specific component flows.
    return Promise.reject(error);
  }
);

export default api;

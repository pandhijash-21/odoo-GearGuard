import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on actual authentication errors, not network errors or verify endpoint
    const isVerifyEndpoint = error.config?.url?.includes('/api/auth/verify');
    const isLoginEndpoint = error.config?.url?.includes('/api/auth/login');
    const isAuthEndpoint = isVerifyEndpoint || isLoginEndpoint;
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Don't redirect if we're already on login page
      if (!window.location.pathname.includes('/login')) {
        // Only clear and redirect if it's a real auth error
        const errorMessage = error.response?.data?.error || '';
        if (errorMessage.includes('Token') || errorMessage.includes('credential') || errorMessage.includes('Unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Use setTimeout to avoid redirect during render
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

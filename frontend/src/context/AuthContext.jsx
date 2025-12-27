import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Try to restore user from localStorage first
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');
  
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(savedToken);

  useEffect(() => {
    // If we have saved user but no token, still allow access (for refresh scenarios)
    if (savedUser && !token) {
      setLoading(false);
      return;
    }
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.post('/api/auth/verify.php', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Token verification failed:', error);
      // Only clear if it's actually an auth error, not a network error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
      // If network error, keep the saved user/token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login.php', { email, password });
      const { user: userData, token: newToken } = response.data.data;
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'admin';
  const isManager = () => user?.role === 'manager';
  const isTechnician = () => user?.role === 'technician';
  const isEmployee = () => user?.role === 'employee';

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAdmin,
    isManager,
    isTechnician,
    isEmployee,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


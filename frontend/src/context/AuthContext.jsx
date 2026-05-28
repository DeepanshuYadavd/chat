import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('omnichat_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signin', { email, password });
      const responseData = response.data.data;
      const userData = {
        id: responseData.id,
        userName: responseData.userName || responseData.name,
        email: responseData.email
      };
      setUser(userData);
      localStorage.setItem('omnichat_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      setError(errMsg);
      setLoading(false);
      return { success: false, message: errMsg };
    }
  };

  const signup = async (userName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signup', { userName, email, password });
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      setLoading(false);
      return { success: false, message: errMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('omnichat_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

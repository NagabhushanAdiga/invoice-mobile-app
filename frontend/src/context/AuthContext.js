import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const userData = await authService.getMe();
      setUser(userData);
    } catch (e) {
      await setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e) {
      return { success: false, error: e.data?.error || e.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await authService.register(name, email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e) {
      return { success: false, error: e.data?.error || e.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUser(null);
    await setToken(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e) {
      return { success: false, error: e.data?.error || e.message || 'Failed to change password' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

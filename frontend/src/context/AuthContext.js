import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const USERS_KEY = 'invoice_app_users';
const CURRENT_USER_KEY = 'invoice_app_user';

const DEMO_USER = {
  email: 'user@invoice.com',
  password: 'password123',
  name: 'John Doe',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const findUser = async (email, password) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      return { email, name: DEMO_USER.name };
    }
    try {
      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users = stored ? JSON.parse(stored) : [];
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      return found ? { email: found.email, name: found.name } : null;
    } catch (e) {
      return null;
    }
  };

  const login = async (email, password) => {
    const userData = await findUser(email, password);
    if (userData) {
      setUser(userData);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (name, email, password) => {
    try {
      const stored = await AsyncStorage.getItem(USERS_KEY);
      const users = stored ? JSON.parse(stored) : [];
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        return { success: false, error: 'Email already registered' };
      }
      const newUser = { name: name.trim(), email: email.trim().toLowerCase(), password };
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      const userData = { email: newUser.email, name: newUser.name };
      setUser(userData);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

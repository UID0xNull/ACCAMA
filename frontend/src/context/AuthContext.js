import React, { createContext, useState, useEffect } from 'react';
import { parseJwt } from '../utils/jwt';

export const AuthContext = createContext({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  loadFromStorage: () => {}
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const login = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    if (newToken) localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
      const payload = parseJwt(stored);
      setRole(payload?.role || null);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loadFromStorage }}>
      {children}
    </AuthContext.Provider>
  );
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: number;
  username: string;
  permissions: string[];
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then(data => setAdmin(data.admin))
        .catch(() => {
          setToken(null);
          setAdmin(null);
          localStorage.removeItem('admin_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (username: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return { success: false, error: data?.error || `HTTP ${res.status} Error` };
      
      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem('admin_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

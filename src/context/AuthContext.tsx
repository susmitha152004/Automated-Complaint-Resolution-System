import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (email?: string, name?: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  switchDemoRole: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('app_auth_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('app_auth_token');
      if (!token) {
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setAuthState({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem('app_auth_token');
          setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('app_auth_token', data.token);
    setAuthState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const loginWithGoogle = async (googleEmail?: string, googleName?: string) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: googleEmail || 'sumisumi891988@gmail.com', name: googleName || 'Sumi' }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google sign in failed');
    }

    localStorage.setItem('app_auth_token', data.token);
    setAuthState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (name: string, email: string, password: string, phone?: string, role?: 'user' | 'admin') => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('app_auth_token', data.token);
    setAuthState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('app_auth_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    const token = authState.token;
    if (!token) return;

    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to update profile');
    }

    setAuthState((prev) => ({
      ...prev,
      user: result.user,
    }));
  };

  const switchDemoRole = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@gov.org' : 'sarah@example.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

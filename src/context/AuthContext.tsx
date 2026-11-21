'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { User } from '../types';
import { apiRequest, getAuthToken, setAuthToken } from '../lib/api';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '472203862027-hclj7agnkb8smosbmt6cm83hetkc75tu.apps.googleusercontent.com';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  handleGoogleCredential: (credential: string) => Promise<boolean>;
  updateProfile: (name: string, photoURL: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session on mount without redirecting to login on refresh!
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const savedUserStr = localStorage.getItem('carewave_user');

      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      if (token) {
        try {
          const res = await apiRequest('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('carewave_user', JSON.stringify(res.user));
          } else {
            // Token invalid or expired
            setAuthToken(null);
            localStorage.removeItem('carewave_user');
            setUser(null);
          }
        } catch (err) {
          console.error('Session restore check error:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token && res.user) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('carewave_user', JSON.stringify(res.user));
        toast.success(res.message || 'Logged in successfully!');
        return true;
      } else {
        toast.error(res.message || 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed due to a network error.');
      return false;
    }
  };

  const register = async (name: string, email: string, photoURL: string, password: string): Promise<boolean> => {
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, photoURL, password }),
      });

      if (res.success && res.token && res.user) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('carewave_user', JSON.stringify(res.user));
        Swal.fire({
          icon: 'success',
          title: 'Welcome to CareWave!',
          text: res.message || 'Your account was created successfully.',
          confirmButtonColor: '#059669',
        });
        return true;
      } else {
        toast.error(res.message || 'Registration failed.');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    }
  };

  const googleLogin = async (): Promise<boolean> => {
    try {
      // Prompt user or use default Google account simulation
      const { value: email } = await Swal.fire({
        title: 'Sign in with Google',
        input: 'email',
        inputLabel: 'Enter your Google Account email',
        inputValue: 'volunteer.carewave@gmail.com',
        inputPlaceholder: 'user@gmail.com',
        showCancelButton: true,
        confirmButtonText: 'Continue with Google',
        confirmButtonColor: '#059669',
      });

      if (!email) return false;

      const userName = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

      const res = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name: formattedName,
          photoURL: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`
        }),
      });

      if (res.success && res.token && res.user) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('carewave_user', JSON.stringify(res.user));
        toast.success('Logged in with Google successfully!');
        return true;
      } else {
        toast.error(res.message || 'Google authentication failed.');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in error.');
      return false;
    }
  };

  const handleGoogleCredential = async (credential: string): Promise<boolean> => {
    try {
      // Decode JWT token payload safely without external dependencies
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const email = payload.email;
      const name = payload.name || (email ? email.split('@')[0] : 'Volunteer');
      const photoURL = payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      const res = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ name, email, photoURL }),
      });

      if (res.success && res.token && res.user) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('carewave_user', JSON.stringify(res.user));
        toast.success(res.message || 'Logged in with Google successfully!');
        return true;
      } else {
        toast.error(res.message || 'Google authentication failed.');
        return false;
      }
    } catch (err: any) {
      console.error('Google credential parse error:', err);
      toast.error('Failed to authenticate with Google.');
      return false;
    }
  };

  const updateProfile = async (name: string, photoURL: string): Promise<boolean> => {
    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, photoURL }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('carewave_user', JSON.stringify(res.user));
        toast.success(res.message || 'Profile updated successfully!');
        return true;
      } else {
        toast.error(res.message || 'Failed to update profile.');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('carewave_user');
    setUser(null);
    toast.success('Logged out successfully. Thank you for making a difference!');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, loading, login, register, googleLogin, handleGoogleCredential, updateProfile, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

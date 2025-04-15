"use client";

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/lib/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      // First check if user data exists in sessionStorage
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }
      
      // If not in sessionStorage but we have a token, try to refresh and get profile
      if (sessionStorage.getItem('accessToken')) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          await fetchUserProfile();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.user) {
        setUser(response.user);
        // User data is already stored in sessionStorage by authService
      }
      return true;
    } catch (error) {
      console.log('Profile fetch failed:', error.message);
      return false;
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.log('Token refresh failed:', error.message);
      setUser(null);
      return false;
    }
  };


  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Don't show errors to user in development mode
      if (process.env.NODE_ENV !== 'development') {
        setError(err.message || 'Failed to logout');
      }
    } finally {
      // Always clear the user state, even if API call fails
      setUser(null);
      setLoading(false);
      
      // Always redirect to login page
      router.push('/login');
    }
  };

  // Check if user has a specific role - memoize to avoid recreating on every render
  const hasRole = useCallback((role) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }, [user]);

  // Create a new user (admin only)
  const createUser = async (userData) => {
    setLoading(true);
    try {
      // Try to create user
      const response = await authService.createUser(userData);
      return response;
    } catch (err) {
      // If token expired, try refreshing and retrying
      if (err.message.includes('unauthorized') || err.message.includes('expired')) {
        try {
          return await authService.createUser(userData);
        } catch (refreshErr) {
          setError(refreshErr.message || 'Session expired. Please login again.');
          throw refreshErr;
        }
      }
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    createUser,
    isAuthenticated: !!user,
    fetchUserProfile,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
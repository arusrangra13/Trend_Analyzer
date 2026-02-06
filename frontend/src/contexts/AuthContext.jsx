import React, { createContext, useContext, useState, useEffect } from 'react';
import UserStorageService from '../services/userStorageService'; // Reuse your storage service

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on startup
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      // Ensure UserStorageService knows the user ID after refresh
      if (parsedUser.sub || parsedUser.id) {
        UserStorageService.setCurrentUserId(parsedUser.sub || parsedUser.id);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save session
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // Save subscription and profile data to localStorage if they exist
      if (data.user.subscription) {
        UserStorageService.setItem('subscriptionData', JSON.stringify(data.user.subscription), data.user.sub);
      }
      if (data.user.profileData) {
        UserStorageService.setItem('userProfileData', JSON.stringify(data.user.profileData), data.user.sub);
      }
      
      // Update UserStorageService current user ID for data separation
      UserStorageService.setCurrentUserId(data.user.sub);

      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Save session
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // Save subscription and profile data to localStorage if they exist
      if (data.user.subscription) {
        UserStorageService.setItem('subscriptionData', JSON.stringify(data.user.subscription), data.user.sub);
      }
      if (data.user.profileData) {
        UserStorageService.setItem('userProfileData', JSON.stringify(data.user.profileData), data.user.sub);
      }
      
      UserStorageService.setCurrentUserId(data.user.sub);

      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    UserStorageService.removeItem('subscriptionData');
    UserStorageService.removeItem('userProfileData');
    UserStorageService.clearCurrentUserId();
    
    setToken(null);
    setUser(null);
    
    // Redirect logic usually handled by component observing auth state
    window.location.href = '/'; 
  };
  
  // Helper specifically to replace getAccessTokenSilently from Auth0
  const getAccessTokenSilently = async () => {
    return token;
  };
  
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    
    // Also sync sub-fields if they were passed
    if (updatedUser.subscription) {
      UserStorageService.setItem('subscriptionData', JSON.stringify(updatedUser.subscription), updatedUser.sub);
    }
    if (updatedUser.profileData) {
      UserStorageService.setItem('userProfileData', JSON.stringify(updatedUser.profileData), updatedUser.sub);
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        register, 
        logout, 
        loading, 
        isAuthenticated: !!user,
        updateUserData,
        getAccessTokenSilently // Keeping similar API surface to help migration
    }}>
      {children}
    </AuthContext.Provider>
  );
};

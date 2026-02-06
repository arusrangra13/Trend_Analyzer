import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import UserStorageService from '../services/userStorageService';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Set current user ID for storage service
      UserStorageService.setCurrentUserId(user.sub);
      setCurrentUserId(user.sub);
      
      // Migrate any old data to user-specific format
      const migratedKeys = UserStorageService.migrateOldData(user.sub);
      
      setIsUserDataLoaded(true);
    } else if (!isLoading) {
      // Clear user data when logged out
      UserStorageService.clearCurrentUserId();
      setCurrentUserId(null);
      setIsUserDataLoaded(true);
    }
  }, [user, isAuthenticated, isLoading]);

  // Get user-specific storage key
  const getUserStorageKey = (baseKey) => {
    return currentUserId ? `user_${currentUserId}_${baseKey}` : baseKey;
  };

  // Clear all user data
  const clearUserData = () => {
    if (currentUserId) {
      UserStorageService.clearUserData(currentUserId);
    }
  };

  // Get storage usage for current user
  const getStorageUsage = () => {
    return UserStorageService.getStorageUsage(currentUserId);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    currentUserId,
    isUserDataLoaded,
    getUserStorageKey,
    clearUserData,
    getStorageUsage,
    UserStorageService
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
// User-specific localStorage service

class UserStorageService {
  // Get user-specific storage key
  static getUserKey(baseKey, userId) {
    return `user_${userId}_${baseKey}`;
  }

  // Get current user ID from Auth0
  static getCurrentUserId() {
    try {
      // Try to get from localStorage (fallback)
      const currentUser = localStorage.getItem('current_user_id');
      if (currentUser) return currentUser;

      // Try to get from sessionStorage
      const sessionUser = sessionStorage.getItem('current_user_id');
      if (sessionUser) return sessionUser;

      return null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  // Set current user ID
  static setCurrentUserId(userId) {
    try {
      localStorage.setItem('current_user_id', userId);
      sessionStorage.setItem('current_user_id', userId);
    } catch (error) {
      console.error('Error setting current user ID:', error);
    }
  }

  // Clear current user ID
  static clearCurrentUserId() {
    try {
      localStorage.removeItem('current_user_id');
      sessionStorage.removeItem('current_user_id');
    } catch (error) {
      console.error('Error clearing current user ID:', error);
    }
  }

  // Get user-specific item
  static getItem(baseKey, userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();

      if (currentUserId) {
        const userKey = this.getUserKey(baseKey, currentUserId);
        const userItem = localStorage.getItem(userKey);
        if (userItem) return userItem;
      }

      // Fallback to non-user-specific key (for backward compatibility or unauthenticated users)
      return localStorage.getItem(baseKey);
    } catch (error) {
      console.error(`Error getting user item ${baseKey}:`, error);
      return null;
    }
  }

  // Set user-specific item
  static setItem(baseKey, value, userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();

      if (currentUserId) {
        const userKey = this.getUserKey(baseKey, currentUserId);
        localStorage.setItem(userKey, value);
      } else {
        // Fallback to non-user-specific key
        localStorage.setItem(baseKey, value);
      }
      return true;
    } catch (error) {
      console.error(`Error setting user item ${baseKey}:`, error);
      return false;
    }
  }

  // Remove user-specific item
  static removeItem(baseKey, userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();
      if (!currentUserId) return false;

      const userKey = this.getUserKey(baseKey, currentUserId);
      localStorage.removeItem(userKey);
      return true;
    } catch (error) {
      console.error(`Error removing user item ${baseKey}:`, error);
      return false;
    }
  }

  // Get all keys for current user
  static getUserKeys(userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();
      if (!currentUserId) return [];

      const userPrefix = `user_${currentUserId}_`;
      const keys = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(userPrefix)) {
          keys.push(key);
        }
      }

      return keys;
    } catch (error) {
      console.error('Error getting user keys:', error);
      return [];
    }
  }

  // Clear all data for current user
  static clearUserData(userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();
      if (!currentUserId) return false;

      const userKeys = this.getUserKeys(currentUserId);
      userKeys.forEach(key => localStorage.removeItem(key));

      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }

  // Get all user IDs that have data
  static getAllUserIds() {
    try {
      const userIds = new Set();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_')) {
          const match = key.match(/^user_([^_]+)_/);
          if (match && match[1]) {
            userIds.add(match[1]);
          }
        }
      }

      return Array.from(userIds);
    } catch (error) {
      console.error('Error getting all user IDs:', error);
      return [];
    }
  }

  // Migrate old data to user-specific format
  static migrateOldData(userId) {
    try {
      const oldKeys = [
        'userProfileData',
        'subscriptionData',
        'scriptHistory',
        'trendingTopics',
        'socialMediaData'
      ];

      const migrated = [];

      oldKeys.forEach(oldKey => {
        const oldValue = localStorage.getItem(oldKey);
        if (oldValue) {
          this.setItem(oldKey, oldValue, userId);
          localStorage.removeItem(oldKey);
          migrated.push(oldKey);
        }
      });

      return migrated;
    } catch (error) {
      console.error('Error migrating old data:', error);
      return [];
    }
  }

  // Get storage usage for current user
  static getStorageUsage(userId = null) {
    try {
      const currentUserId = userId || this.getCurrentUserId();
      if (!currentUserId) return { size: 0, count: 0 };

      const userKeys = this.getUserKeys(currentUserId);
      let totalSize = 0;

      userKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      });

      return {
        size: totalSize,
        count: userKeys.length,
        keys: userKeys
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return { size: 0, count: 0 };
    }
  }
}

export default UserStorageService;

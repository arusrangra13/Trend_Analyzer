// Backend API service for Trend Analyzer

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class BackendService {
  // Get Auth0 access token
  static async getAccessToken() {
    try {
      const { getAccessTokenSilently } = await import('@auth0/auth0-react');
      // This will be called from components that have access to useAuth0
      return null; // Token will be passed from component
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Generic API request method
  static async apiRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authenticated API request
  static async authenticatedRequest(endpoint, options = {}) {
    try {
      // Get token from component (passed in options)
      const token = options.token;
      
      if (!token) {
        throw new Error('Authentication token required');
      }

      return await this.apiRequest(endpoint, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });
    } catch (error) {
      console.error(`Authenticated request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // User profile methods
  static async getUserProfile(token) {
    return await this.authenticatedRequest('/users/profile', { token });
  }

  static async saveUserProfile(profileData, token) {
    return await this.authenticatedRequest('/users/profile', {
      method: 'POST',
      body: JSON.stringify({ profileData }),
      token
    });
  }

  static async createOrUpdateUser(token) {
    return await this.authenticatedRequest('/users', {
      method: 'POST',
      token
    });
  }

  static async updateSubscription(subscription, token) {
    return await this.authenticatedRequest('/users/subscription', {
      method: 'PUT',
      body: JSON.stringify({ subscription }),
      token
    });
  }

  // Health check
  static async healthCheck() {
    return await this.apiRequest('/health');
  }

  // Fallback methods for when backend is not available
  static async safeGetUserProfile(token) {
    try {
      return await this.getUserProfile(token);
    } catch (error) {
      console.warn('Backend not available, using localStorage fallback');
      return null;
    }
  }

  static async safeSaveUserProfile(profileData, token) {
    try {
      return await this.saveUserProfile(profileData, token);
    } catch (error) {
      console.warn('Backend not available, using localStorage fallback');
      return null;
    }
  }
}

export default BackendService;

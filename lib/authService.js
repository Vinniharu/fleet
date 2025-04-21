const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Authentication API service
 * Handles API calls to authentication endpoints
 */
const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and tokens
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      // Store both the access token and user data
      sessionStorage.setItem('accessToken', JSON.stringify(data.accessToken));
      sessionStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - Response with user profile data
   */
  getProfile: async () => {
    try {
      // Check if user data exists in sessionStorage
      const userData = sessionStorage.getItem('user');
      if (userData) {
        return { user: JSON.parse(userData) };
      }
      
      // Check if we have an access token - if not, don't bother calling the API
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No access token found, skipping profile fetch');
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(accessToken)}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      const data = await response.json();
      // Store user data in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Refresh the access token
   * @returns {Promise} - Response with new tokens
   */
  refreshToken: async () => {
    try {
      const response = await fetch(`https://www.briechuas.com/flmgt/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log(data);
      // Store new token in sessionStorage
      sessionStorage.setItem('accessToken', JSON.stringify(data.accessToken));
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} - Response with logout status
   */
  logout: async () => {
    try {
      // Clear sessionStorage
      sessionStorage.clear();
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear sessionStorage even if there's an error
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      throw error;
    }
  },

  /**
   * Create a new user (Admin only)
   * @param {Object} userData - User data (username, email, password, role)
   * @returns {Promise} - Response with created user data
   */
  createUser: async (userData) => {
    try {
      const makeRequest = async () => {
        const response = await fetch(`${API_BASE_URL}/auth/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          },
          credentials: 'include',
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          // If unauthorized, try refreshing token
          if (response.status === 401) {
            throw new Error('Unauthorized - token may be expired');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create user');
        }

        return await response.json();
      };

      try {
        return await makeRequest();
      } catch (error) {
        // If unauthorized, try refreshing token and retry
        if (error.message.includes('Unauthorized') || error.message.includes('token')) {
          await authService.refreshToken();
          return await makeRequest();
        }
        throw error;
      }
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  /**
   * Access admin dashboard (Admin only)
   * @returns {Promise} - Response with admin dashboard data
   */
  getAdminDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to access admin dashboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Admin dashboard error:', error);
      throw error;
    }
  },

  /**
   * Access pilot controls (Pilot only)
   * @returns {Promise} - Response with pilot controls data
   */
  getPilotControls: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/pilot/controls`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to access pilot controls');
      }

      return await response.json();
    } catch (error) {
      console.error('Pilot controls error:', error);
      throw error;
    }
  },

  /**
   * Access telemetry data (Data Engineer or Admin only)
   * @returns {Promise} - Response with telemetry data
   */
  getTelemetryData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/data/telemetry`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to access telemetry data');
      }

      return await response.json();
    } catch (error) {
      console.error('Telemetry data error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated and refresh token if needed
   * @returns {Promise<boolean>} - True if user is authenticated
   */
  isAuthenticated: async () => {
    try {
      // Check if user data exists in sessionStorage
      const userData = sessionStorage.getItem('user');
      if (userData) {
        return true;
      }
      
      // Check if access token exists in sessionStorage
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        return false;
      }
      
      // If we have a token but no user data, try to get the profile
      const response = await authService.getProfile();
      return !!response.user;
    } catch (error) {
      // Try to refresh the token
      try {
        await authService.refreshToken();
        const response = await authService.getProfile();
        return !!response.user;
      } catch (refreshError) {
        // Clear any invalid session data
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        return false;
      }
    }
  }
};

export default authService; 
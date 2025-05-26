import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { endpoints, getAuthHeaders } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Try admin endpoint first
      try {
        const adminResponse = await axios.get(endpoints.auth.adminMe, {
          headers: getAuthHeaders()
        });
        if (adminResponse.data) {
          setUser({ ...adminResponse.data, isAdmin: true });
          setLoading(false);
          return;
        }
      } catch (adminError) {
        console.log('Not an admin user, trying regular user endpoint');
      }

      // Try regular user endpoint
      const userResponse = await axios.get(endpoints.auth.me, {
        headers: getAuthHeaders()
      });
      if (userResponse.data) {
        setUser({ ...userResponse.data, isAdmin: false });
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? endpoints.auth.adminLogin : endpoints.auth.login;
      const response = await axios.post(endpoint, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser({ ...user, isAdmin });
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(endpoints.auth.register, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser({ ...user, isAdmin: false });
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      if (token) {
        // Set the token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get('/api/auth/me');
        setUser(response.data);
      }
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/api/admin/login' : '/api/auth/login';
      const response = await axios.post(endpoint, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
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

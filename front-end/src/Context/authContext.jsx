import { createContext, useContext, useState, useEffect } from 'react';
import {api} from '../services/apiService';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set token ke header axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Ambil data user
          const userData = await userService.getProfile();
          setUser(userData);
          
          // Redirect berdasarkan role
          if (userData.role === 'admin') {
            router.push('/admin');
          } else if (userData.role === 'officer') {
            router.push('/officer');
          } else {
            router.push('/user');
          }
        } catch (err) {
          console.error('Failed to load user', err);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      
      // Simpan token ke localStorage
      localStorage.setItem('token', token);
      
      // Set token ke header axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Ambil data user
      const userData = await userService.getProfile();
      setUser(userData);
      
      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.role === 'officer') {
        router.push('/officer');
      } else {
        router.push('/user');
      }
      
      return userData;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateUser(user._id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateProfile,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
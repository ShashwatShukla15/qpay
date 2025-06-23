import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8000';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (rawUser && rawUser !== 'undefined' && token) {
        setCurrentUser(JSON.parse(rawUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${baseURL}/api/auth/login`, { email, password });
    if (!res.data?.user) throw new Error("User not found in login response");
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setCurrentUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  };

  const signup = async ({ name, email, phone, password }) => {
    const res = await axios.post(`${baseURL}/api/auth/signup`, { name, email, phone, password });
    if (!res.data?.user) throw new Error("User not found in signup response");
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setCurrentUser(res.data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

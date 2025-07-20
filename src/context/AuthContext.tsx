import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'booker';
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isOwner: boolean;
  isBooker: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to check token expiry
  const isTokenExpired = (jwt: string) => {
    try {
      const decoded: any = jwtDecode(jwt);
      if (!decoded.exp) return false;
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (jwt: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/user/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'Error fetching user profile');
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        fetchUserProfile(token);
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
    // eslint-disable-next-line
  }, [token]);

  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    await fetchUserProfile(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isOwner = user?.role === 'owner';
  const isBooker = user?.role === 'booker';

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isOwner, isBooker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};


import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_PASSWORD = 'demo@2024';
const ADMIN_CREDENTIALS = { username: 'admin', password: 'demo@2024', role: 'admin' as const };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check if it's admin login
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = { username: ADMIN_CREDENTIALS.username, role: ADMIN_CREDENTIALS.role };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Track login for analytics
      const loginCount = localStorage.getItem('login_count') || '0';
      const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
      
      userLogins[username] = (userLogins[username] || 0) + 1;
      localStorage.setItem('login_count', (parseInt(loginCount) + 1).toString());
      localStorage.setItem('user_logins', JSON.stringify(userLogins));
      localStorage.setItem('last_login', new Date().toISOString());
      
      return true;
    }
    
    // Check if it's a regular user with demo password (any username allowed)
    if (password === DEMO_PASSWORD && username !== ADMIN_CREDENTIALS.username) {
      const userData = { username: username, role: 'user' as const };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Track login for analytics
      const loginCount = localStorage.getItem('login_count') || '0';
      const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
      
      userLogins[username] = (userLogins[username] || 0) + 1;
      localStorage.setItem('login_count', (parseInt(loginCount) + 1).toString());
      localStorage.setItem('user_logins', JSON.stringify(userLogins));
      localStorage.setItem('last_login', new Date().toISOString());
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


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
      try {
        const loginCount = localStorage.getItem('login_count') || '0';
        const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
        
        userLogins[username] = (userLogins[username] || 0) + 1;
        const newTotalLogins = parseInt(loginCount) + 1;
        localStorage.setItem('login_count', newTotalLogins.toString());
        localStorage.setItem('user_logins', JSON.stringify(userLogins));
        localStorage.setItem('last_login', new Date().toISOString());
        
        // Store complete login activity log
        const loginActivities = JSON.parse(localStorage.getItem('login_activities') || '[]');
        const loginActivity = {
          id: Date.now().toString(),
          username,
          role: 'admin',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: Math.random().toString(36).substr(2, 9)
        };
        loginActivities.push(loginActivity);
        // Keep only last 100 activities to prevent storage bloat
        if (loginActivities.length > 100) {
          loginActivities.splice(0, loginActivities.length - 100);
        }
        localStorage.setItem('login_activities', JSON.stringify(loginActivities));
        
        console.log('Admin login tracked successfully:', {
          username,
          totalLogins: newTotalLogins,
          userLoginCount: userLogins[username],
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to track admin login:', error);
      }
      
      return true;
    }
    
    // Check if it's a regular user with demo password (any username allowed)
    if (password === DEMO_PASSWORD && username !== ADMIN_CREDENTIALS.username) {
      const userData = { username: username, role: 'user' as const };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Track login for analytics
      try {
        const loginCount = localStorage.getItem('login_count') || '0';
        const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
        
        userLogins[username] = (userLogins[username] || 0) + 1;
        const newTotalLogins = parseInt(loginCount) + 1;
        localStorage.setItem('login_count', newTotalLogins.toString());
        localStorage.setItem('user_logins', JSON.stringify(userLogins));
        localStorage.setItem('last_login', new Date().toISOString());
        
        // Store complete login activity log
        const loginActivities = JSON.parse(localStorage.getItem('login_activities') || '[]');
        const loginActivity = {
          id: Date.now().toString(),
          username,
          role: 'user',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: Math.random().toString(36).substr(2, 9)
        };
        loginActivities.push(loginActivity);
        // Keep only last 100 activities to prevent storage bloat
        if (loginActivities.length > 100) {
          loginActivities.splice(0, loginActivities.length - 100);
        }
        localStorage.setItem('login_activities', JSON.stringify(loginActivities));
        
        console.log('Demo user login tracked successfully:', {
          username,
          totalLogins: newTotalLogins,
          userLoginCount: userLogins[username],
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to track demo user login:', error);
      }
      
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

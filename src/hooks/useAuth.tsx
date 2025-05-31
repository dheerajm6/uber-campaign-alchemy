
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

// Hardcoded credentials
const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as const },
  user: { username: 'user', password: 'user123', role: 'user' as const }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const credential = Object.values(CREDENTIALS).find(
      cred => cred.username === username && cred.password === password
    );

    if (credential) {
      const userData = { username: credential.username, role: credential.role };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
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

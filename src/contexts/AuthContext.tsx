import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.find((u: User) => u.email === userData.email)) {
        return false; // Email already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
      };

      // Store user credentials and data
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Store password separately (in real app, this would be hashed)
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
      passwords[userData.email] = userData.password;
      localStorage.setItem('passwords', JSON.stringify(passwords));

      // Initialize empty data for the user
      localStorage.setItem(`userData_${newUser.id}`, JSON.stringify({
        employees: [],
        companies: [],
        applicants: [],
        payroll: []
      }));

      // Auto-login after registration
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
      
      const user = users.find((u: User) => u.email === email);
      
      if (user && passwords[email] === password) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
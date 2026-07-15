import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/apiClient';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'QA_ENGINEER' | 'PRODUCT_OWNER' | 'VIEWER';
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  switchRole: (role: UserProfile['role']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default demo user right out of the box
    return {
      id: 'usr-demo-admin',
      email: 'admin@taskpilot.ai',
      fullName: 'Sarah Connor (Admin)',
      role: 'ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahConnor',
    };
  });

  const login = async (email: string, password = 'Password123!') => {
    try {
      const res: any = await api.login({ email, password });
      if (res?.user) {
        setUser(res.user);
      }
    } catch (err) {
      // If backend login fails during local demo or testing, create mock user profile
      const roleMap: any = {
        'admin@taskpilot.ai': 'ADMIN',
        'pm@taskpilot.ai': 'PROJECT_MANAGER',
        'dev@taskpilot.ai': 'DEVELOPER',
        'qa@taskpilot.ai': 'QA_ENGINEER',
        'po@taskpilot.ai': 'PRODUCT_OWNER',
        'viewer@taskpilot.ai': 'VIEWER',
      };
      const mockRole = roleMap[email.toLowerCase()] || 'DEVELOPER';
      const mockUser: UserProfile = {
        id: `usr-mock-${Date.now()}`,
        email,
        fullName: email.split('@')[0].toUpperCase(),
        role: mockRole,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'mock-jwt-token-for-demo-testing');
    }
  };

  const switchRole = (role: UserProfile['role']) => {
    // BUG-FE-02 intentional defect: Role switch updates state and localStorage but omits react-query cache purge, leaving stale role permissions in cached query results
    if (!user) return;
    const roleNames: any = {
      ADMIN: 'Sarah Connor (Admin)',
      PROJECT_MANAGER: 'Marcus Vance (PM)',
      DEVELOPER: 'Alex Rivera (Senior Dev)',
      QA_ENGINEER: 'Elena Rostova (Lead QA)',
      PRODUCT_OWNER: 'David Chen (PO)',
      VIEWER: 'Maya Lin (Auditor)',
    };
    const updated: UserProfile = {
      ...user,
      role,
      fullName: roleNames[role] || `${role} User`,
      email: `${role.toLowerCase()}@taskpilot.ai`,
    };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

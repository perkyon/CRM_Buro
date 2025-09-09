import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    email: 'manager@woodcraft.ru',
    phone: '+7 (495) 123-45-67',
    role: 'manager',
  },
  {
    id: '2',
    name: 'Михаил Петров',
    email: 'director@woodcraft.ru',
    phone: '+7 (495) 123-45-68',
    role: 'director',
  },
  {
    id: '3',
    name: 'Сергей Смирнов',
    email: 'production@woodcraft.ru',
    phone: '+7 (495) 123-45-69',
    role: 'production_manager',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          // Create user object
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email || 'Unknown',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone,
            role: session.user.user_metadata?.role || 'manager',
          };
          
          setUser(userData);
          setAccessToken(session.access_token);
        }
      } catch (error) {
        console.error('Auth session error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email || 'Unknown',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone,
            role: session.user.user_metadata?.role || 'manager',
          };
          
          setUser(userData);
          setAccessToken(session.access_token);
        } else {
          setUser(null);
          setAccessToken(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
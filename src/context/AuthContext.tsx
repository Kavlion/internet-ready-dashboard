
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { auth } from '@/services/api';

type User = {
  id: string;
  username: string;
  role: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isPinAuthenticated: boolean;
  isLoading: boolean;
  pinAttempts: number;
  blockUntil: Date | null;
  login: (username: string, password: string) => Promise<boolean>;
  verifyPin: (pin: string) => boolean;
  logout: () => Promise<void>;
  resetPinAttempts: () => void;
};

const PIN = '1234'; // Default PIN code

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = await auth.profile();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Check if PIN was previously authenticated in this session
          const pinVerified = sessionStorage.getItem('pinVerified');
          if (pinVerified === 'true') {
            setIsPinAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await auth.login(username, password);
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Store user data
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPin = (pin: string) => {
    // Check if we're in a block period
    if (blockUntil && new Date() < blockUntil) {
      return false;
    }

    // Reset block if it's expired
    if (blockUntil && new Date() > blockUntil) {
      setBlockUntil(null);
      setPinAttempts(0);
    }

    // Verify PIN
    if (pin === PIN) {
      setIsPinAuthenticated(true);
      setPinAttempts(0);
      setBlockUntil(null);
      sessionStorage.setItem('pinVerified', 'true');
      return true;
    } else {
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);
      
      // Set block time based on attempts
      if (newAttempts >= 8) {
        const blockTime = new Date();
        blockTime.setMinutes(blockTime.getMinutes() + 3);
        setBlockUntil(blockTime);
        toast({
          title: "Too many incorrect attempts",
          description: "Please try again after 3 minutes",
          variant: "destructive",
        });
      } else if (newAttempts >= 4) {
        const blockTime = new Date();
        blockTime.setSeconds(blockTime.getSeconds() + 30);
        setBlockUntil(blockTime);
        toast({
          title: "Too many incorrect attempts",
          description: "Please try again after 30 seconds",
          variant: "destructive",
        });
      }
      
      return false;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('pinVerified');
      setUser(null);
      setIsAuthenticated(false);
      setIsPinAuthenticated(false);
    }
  };

  const resetPinAttempts = () => {
    setPinAttempts(0);
    setBlockUntil(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPinAuthenticated,
        isLoading,
        pinAttempts,
        blockUntil,
        login,
        verifyPin,
        logout,
        resetPinAttempts,
      }}
    >
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

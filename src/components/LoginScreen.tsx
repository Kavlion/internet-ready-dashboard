
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { auth } from '@/services/api';

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Iltimos, foydalanuvchi nomi va parolni kiriting');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // First, try to authenticate through the API
      const response = await auth.login(username, password);
      
      if (response && response.accessToken) {
        // Store tokens from API response
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken || '');
        
        // Call login with successful result
        await login(username, password);
        
        toast({
          title: "Muvaffaqiyatli kirish",
          description: "Xush kelibsiz!",
        });
      } else {
        // Fallback to hardcoded login for testing
        throw new Error('API login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to hardcoded login
      if (username === 'admin' && password === '1111') {
        const mockUserData = {
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Admin User'
        };
        
        localStorage.setItem('accessToken', 'mock-token-for-admin');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
        
        await login(username, password);
        
        toast({
          title: "Muvaffaqiyatli kirish",
          description: "Xush kelibsiz, admin!",
        });
      } else {
        setError('Foydalanuvchi nomi yoki parol noto\'g\'ri');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-app-blue rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <h1 className="text-xl font-bold">Dasturga kirish</h1>
            <p className="text-gray-500 text-sm text-center mt-1">
              Iltimos, tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium mb-1 block">Login</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium mb-1 block">Parol</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field w-full pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button 
                type="submit" 
                className="button-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Kutilmoqda...' : 'Kirish'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Parolni unutdingizmi?{' '}
                <a href="#" className="text-app-blue font-medium">
                  Parolni tiklash
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="p-4 text-center text-xs text-gray-500">
        Dasturga kirish, ro'yxatdan o'tish yoki xarid qilish orqali siz bizning
        <a href="#" className="text-app-blue mx-1">
          Foydalanish shartlari
        </a>
        va
        <a href="#" className="text-app-blue mx-1">
          Maxfiylik siyosati
        </a>
        ga rozilik bildirasiz
      </div>
    </div>
  );
};

export default LoginScreen;

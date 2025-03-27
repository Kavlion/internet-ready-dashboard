
import { Link } from 'react-router-dom';
import { User, Home, CalendarDays, Settings as SettingsIcon, ChevronRight, UserCircle, CircleDollarSign, BellRing, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white">
        <h1 className="text-xl font-semibold">Sozlamalar</h1>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {/* Account Section */}
          <div className="space-y-2">
            <h2 className="text-app-blue font-medium text-sm">Akkount</h2>
            
            <Link to="/profile" className="block glass-card">
              <div className="settings-item">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <UserCircle size={18} className="text-app-blue" />
                  </div>
                  <span>Shaxsiy ma'lumotlar</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </Link>
            
            <div className="glass-card">
              <div className="settings-item">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CircleDollarSign size={18} className="text-green-600" />
                  </div>
                  <span>Kontraktlar</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-2">
            <h2 className="text-app-blue font-medium text-sm">Bildirishnomalar</h2>
            
            <div className="glass-card">
              <div className="settings-item">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <BellRing size={18} className="text-purple-600" />
                  </div>
                  <span>Bildirishnomalar</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-2">
            <h2 className="text-app-blue font-medium text-sm">Yordam</h2>
            
            <div className="glass-card">
              <div className="settings-item border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <HelpCircle size={18} className="text-orange-600" />
                  </div>
                  <span>Yordam va ko'maklar</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              
              <div className="settings-item border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <UserCircle size={18} className="text-app-blue" />
                  </div>
                  <span>Dastur haqida</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            className="w-full text-red-500 py-3 font-medium bg-white rounded-lg border border-gray-200"
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center">
              <LogOut size={18} className="mr-2" />
              <span>Chiqish</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="grid grid-cols-4 border-t border-gray-200 bg-white">
        <Link to="/" className="flex flex-col items-center py-3 text-gray-500">
          <Home size={20} />
          <span className="text-xs mt-1">Asosiy</span>
        </Link>
        <Link to="/debtors" className="flex flex-col items-center py-3 text-gray-500">
          <User size={20} />
          <span className="text-xs mt-1">Qarzdorlar</span>
        </Link>
        <Link to="/calendar" className="flex flex-col items-center py-3 text-gray-500">
          <CalendarDays size={20} />
          <span className="text-xs mt-1">Kalendar</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center py-3 text-app-blue">
          <SettingsIcon size={20} />
          <span className="text-xs mt-1">Sozlamalar</span>
        </Link>
      </div>
    </div>
  );
};

export default Settings;

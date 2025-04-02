
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, updateUserAvatar } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Read the file and convert to data URL for local storage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result.toString();
        updateUserAvatar(imageUrl);
        
        toast({
          title: "Rasm saqlandi",
          description: "Profil rasmi muvaffaqiyatli saqlandi",
        });
        
        // Redirect to home page after saving the image
        navigate('/');
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast({
        title: "Xatolik",
        description: "Rasm yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white">
        <div className="flex items-center">
          <Link to="/settings" className="mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Shaxsiy ma'lumotlar</h1>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* Profile Image */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="relative mb-4">
            <div 
              className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleAvatarClick}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 bg-app-blue rounded-full flex items-center justify-center text-white shadow-sm"
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <h2 className="text-lg font-bold">{user?.name || user?.username || 'Technochat'}</h2>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="text-sm text-gray-500 mb-1">Telefon raqami</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-2" />
                <span>+998 93 123 45 67</span>
              </div>
              <CheckCircle2 size={16} className="text-app-green" />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="text-sm text-gray-500 mb-1">Email</div>
            <div className="flex items-center">
              <Mail size={18} className="text-gray-400 mr-2" />
              <span>technochat@gmail.com</span>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="text-sm text-gray-500 mb-1">Manzil</div>
            <p>Toshkent, Uzbekistan</p>
          </div>
        </div>

        {/* Edit Button */}
        <button className="button-primary mt-8 w-full">Ma'lumotlarni o'zgartirish</button>
      </div>
    </div>
  );
};

export default Profile;

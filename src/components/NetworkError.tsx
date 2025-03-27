
import { WifiOff } from 'lucide-react';

const NetworkError = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center justify-center gap-6 max-w-sm text-center">
        <div className="bg-app-light-gray p-6 rounded-full">
          <WifiOff size={48} className="text-app-gray" />
        </div>
        <h2 className="text-xl font-bold">Aloqada xatolik yuz berdi</h2>
        <p className="text-gray-600">
          Internet aloqangizni tekshiring va qayta urinib ko'ring
        </p>
        <button 
          className="button-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Qayta urinish
        </button>
      </div>
    </div>
  );
};

export default NetworkError;

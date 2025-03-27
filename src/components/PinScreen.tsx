
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { XCircle } from 'lucide-react';
import { toast } from 'sonner';

const PinScreen = () => {
  const { verifyPin, pinAttempts, blockUntil } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // If blocked, start countdown
    if (blockUntil) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.ceil((blockUntil.getTime() - now.getTime()) / 1000);
        
        if (diff <= 0) {
          setTimeLeft(null);
          clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [blockUntil]);

  const handleNumberPress = (num: number) => {
    if (blockUntil && new Date() < blockUntil) {
      return;
    }
    
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // If pin is complete, validate it
      if (newPin.length === 4) {
        const success = verifyPin(newPin);
        if (!success) {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-16 h-16 bg-app-blue rounded-full flex items-center justify-center mb-8">
          <span className="text-white text-2xl font-bold">D</span>
        </div>
        <h1 className="text-xl font-bold mb-2">PIN-kodni kiriting</h1>
        
        {timeLeft ? (
          <p className="text-red-500 mb-6">
            {timeLeft > 60 
              ? `${Math.ceil(timeLeft / 60)} daqiqa kutib turing` 
              : `${timeLeft} soniya kutib turing`}
          </p>
        ) : null}
        
        <div className="pin-display">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`pin-dot ${pin.length > i ? 'pin-dot-filled' : ''} ${error ? 'pin-dot-error' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="pin-button"
              onClick={() => handleNumberPress(num)}
              disabled={!!(blockUntil && new Date() < blockUntil)}
            >
              {num}
            </button>
          ))}
          <div className="pin-button invisible"></div>
          <button 
            className="pin-button"
            onClick={() => handleNumberPress(0)}
            disabled={!!(blockUntil && new Date() < blockUntil)}
          >
            0
          </button>
          <button 
            className="pin-button text-xl flex items-center justify-center"
            onClick={handleDelete}
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <button 
          className="text-app-blue mt-6 text-sm"
          onClick={() => {
            toast("PIN-kod yangilanmadi", {
              description: "Administrator bilan bog'laning",
            });
          }}
        >
          PIN-kodni unutdim
        </button>
      </div>
    </div>
  );
};

export default PinScreen;

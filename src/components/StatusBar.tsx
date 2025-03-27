
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, BatteryMedium, BatteryLow } from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';

const StatusBar = () => {
  const { isOnline } = useNetwork();
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate battery level
  useEffect(() => {
    // Randomly set battery level between 60-100%
    setBatteryLevel(Math.floor(Math.random() * 40) + 60);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="status-bar">
      <div className="text-sm font-semibold">{formattedTime}</div>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi size={16} className="text-app-blue" />
        ) : (
          <WifiOff size={16} className="text-app-gray" />
        )}
        
        <div className="flex items-center gap-1">
          {batteryLevel > 80 ? (
            <Battery size={18} className="text-app-green" />
          ) : batteryLevel > 30 ? (
            <BatteryMedium size={18} className="text-app-green" />
          ) : (
            <BatteryLow size={18} className="text-app-red" />
          )}
          <span className="text-xs">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

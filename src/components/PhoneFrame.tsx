
import { useNetwork } from '@/context/NetworkContext';
import StatusBar from './StatusBar';
import NetworkError from './NetworkError';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame = ({ children }: PhoneFrameProps) => {
  const { isOnline } = useNetwork();
  
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <StatusBar />
        {isOnline ? children : <NetworkError />}
      </div>
    </div>
  );
};

export default PhoneFrame;

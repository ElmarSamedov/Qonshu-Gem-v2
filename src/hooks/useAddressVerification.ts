import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export type VerifyMethod = 'select' | 'gps' | 'sms' | 'document' | 'postcard';

export function useAddressVerification(onVerified: (verified: boolean) => void) {
  const [method, setMethod] = useState<VerifyMethod>('select');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'failed'>('idle');
  const [gpsError, setGpsError] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleGPSVerification = () => {
    setGpsStatus('locating');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            onVerified(true);
          } else {
            setGpsStatus('failed');
            setGpsError('You are not located within the neighborhood center. Try another method.');
          }
        }, 1500);
      },
      () => {
        setGpsStatus('failed');
        setGpsError('Unable to retrieve your location. Please ensure location permissions are granted.');
      }
    );
  };

  const handleSmsVerification = () => {
    if (smsCode === '1234') {
      onVerified(true);
    } else {
      setSmsError('Invalid code. Try 1234.'); 
    }
  };

  const handleDocumentUpload = () => {
    if (!file) return;
    onVerified(false); // awaiting manual moderation - see ModeratorPanel
  };

  const handlePostcard = () => {
    onVerified(false); // awaiting postcard delivery
  };

  return {
    method, setMethod,
    gpsStatus, gpsError, handleGPSVerification,
    phone, setPhone, smsCode, setSmsCode, smsError, handleSmsVerification,
    file, setFile, handleDocumentUpload,
    handlePostcard,
  };
}

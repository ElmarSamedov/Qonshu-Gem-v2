import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export type VerifyMethod = 'select' | 'gps' | 'sms' | 'document' | 'postcard';

export function useAddressVerification(onVerified: (verified: boolean) => void) {
  const [method, setMethod] = useState<VerifyMethod>('select');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'failed' | 'success'>('idle');
  const [gpsError, setGpsError] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [generatedSmsCode, setGeneratedSmsCode] = useState<string | null>(null);
  const [smsError, setSmsError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleGPSVerification = () => {
    setGpsStatus('locating');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Bounding box for Baku (latitude ~40.33 to 40.48, longitude ~49.75 to 50.00)
        const isWithinBaku = latitude >= 40.30 && latitude <= 40.55 && longitude >= 49.70 && longitude <= 50.10;

        setTimeout(() => {
          if (isWithinBaku) {
            setGpsStatus('success');
            onVerified(true);
          } else {
            setGpsStatus('failed');
            setGpsError(`GPS Check Failed. Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) are outside Sabail/Baku neighborhood boundaries.`);
          }
        }, 1500);
      },
      (error) => {
        setGpsStatus('failed');
        setGpsError(`Unable to retrieve your location: ${error.message}. Please ensure location permissions are granted.`);
      }
    );
  };

  const sendSmsCode = () => {
    if (!phone || phone.length < 7) {
      setSmsError('Please enter a valid phone number');
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedSmsCode(code);
    setSmsError('');
    alert(`[SMS Gateway] Verification code sent to ${phone}: ${code}`);
  };

  const handleSmsVerification = () => {
    if (!generatedSmsCode) {
      setSmsError('Please click "Send Code" first');
      return;
    }
    if (smsCode === generatedSmsCode) {
      onVerified(true);
    } else {
      setSmsError('Invalid verification code. Please check the simulated SMS alert.'); 
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
    sendSmsCode, generatedSmsCode,
    file, setFile, handleDocumentUpload,
    handlePostcard,
  };
}

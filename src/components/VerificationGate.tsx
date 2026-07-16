import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, ShieldCheck, Upload, Navigation, Clock, Smartphone, FileText, Mail } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';

export default function VerificationGate({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuthStore();
  const { language } = useLanguageStore();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<'select' | 'gps' | 'document' | 'sms' | 'postcard'>('select');
  
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'failed'>('idle');
  const [gpsError, setGpsError] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'pending'>('idle');

  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');

  // Auto-pass if already verified
  if (user?.is_verified) {
    return <>{children}</>;
  }

  const handleGPSVerification = () => {
    setGpsStatus('locating');
    setGpsError('');
    
    // Simulate GPS check
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock successful verification
        setTimeout(() => {
          // 80% chance of success for demo
          if (Math.random() > 0.2) {
            updateUser({ is_verified: true });
          } else {
            setGpsStatus('failed');
            setGpsError('You are not located within the neighborhood center. Try another method.');
          }
        }, 1500);
      },
      (error) => {
        setGpsStatus('failed');
        setGpsError('Unable to retrieve your location. Please ensure location permissions are granted.');
      }
    );
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    
    setTimeout(() => {
      setUploadStatus('pending');
    }, 1500);
  };

  const handleSmsVerification = () => {
    if (smsCode === '1234') {
      updateUser({ is_verified: true });
    } else {
      setSmsError('Invalid code. Try 1234.');
    }
  };

  const handlePostcard = () => {
    setUploadStatus('pending'); // reusing pending state for success UI
  };

  if (uploadStatus === 'pending') {
    return (
      <Card className="glass-panel text-center border-black/10 dark:border-white/10 shadow-2xl">
        <CardContent className="pt-6">
          <Clock className="mx-auto h-12 w-12 text-orange-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Verification in Progress</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your verification request is being processed. 
            If you requested a postcard, it will arrive in 3-5 days. For documents, our local moderators will review it soon.
          </p>
          <Button variant="ghost" className="mt-4 text-slate-600 dark:text-slate-400" onClick={() => { setUploadStatus('idle'); setIsVerifying(false); }}>
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isVerifying) {
    if (verifyMethod === 'select') {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <ShieldCheck className="mr-2 h-5 w-5 text-indigo-500" />
              Verify Address to Fully Participate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm text-left">
              <p className="mb-2"><strong>Why do we ask for this?</strong></p>
              <p>In accordance with the laws of the Republic of Azerbaijan "On Personal Data", we securely process verification data strictly to ensure everyone here actually lives in <strong>{user?.district}</strong>. This keeps our community safe and local. Your data is encrypted and not shared with neighbors.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setVerifyMethod('gps')} className="w-full flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mr-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Geolocation</div>
                  <div className="text-xs text-slate-500">Fastest. We'll check if you are currently at home.</div>
                </div>
              </button>

              <button onClick={() => setVerifyMethod('sms')} className="w-full flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mr-4">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Phone Verification</div>
                  <div className="text-xs text-slate-500">SMS code sent to the number matching your address.</div>
                </div>
              </button>

              <button onClick={() => setVerifyMethod('document')} className="w-full flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 mr-4">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Upload Document</div>
                  <div className="text-xs text-slate-500">Manual review. Upload a utility bill or lease agreement.</div>
                </div>
              </button>

              <button onClick={() => setVerifyMethod('postcard')} className="w-full flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Postcard</div>
                  <div className="text-xs text-slate-500">Mail with verification code sent to your address.</div>
                </div>
              </button>
            </div>
            
            <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5 mt-2" onClick={() => setIsVerifying(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (verifyMethod === 'gps') {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <Navigation className="mr-2 h-5 w-5 text-green-500" />
              Location Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
              We need access to your device's location to confirm you are in <strong>{user?.district}</strong>.
            </p>
            
            {gpsStatus === 'failed' && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-200">
                {gpsError}
              </div>
            )}
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleGPSVerification}
              disabled={gpsStatus === 'locating'}
            >
              {gpsStatus === 'locating' ? 'Checking location...' : 'Share Location & Verify'}
            </Button>
            
            <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5" onClick={() => setVerifyMethod('select')}>
              Back
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (verifyMethod === 'sms') {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <Smartphone className="mr-2 h-5 w-5 text-blue-500" />
              Phone Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Enter your phone number. The number must be registered to your name and address in {user?.district}.
            </p>
            <Input type="tel" placeholder="+994" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white dark:bg-slate-800" />
            
            {phone.length > 8 && (
              <Input type="text" placeholder="SMS Code (try 1234)" value={smsCode} onChange={e => setSmsCode(e.target.value)} className="bg-white dark:bg-slate-800" />
            )}
            
            {smsError && <p className="text-sm text-red-500">{smsError}</p>}
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSmsVerification}
            >
              Verify Phone
            </Button>
            
            <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5" onClick={() => setVerifyMethod('select')}>
              Back
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (verifyMethod === 'postcard') {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <Mail className="mr-2 h-5 w-5 text-purple-500" />
              Postcard Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center py-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              We will send a postcard with a verification code to:<br/>
              <strong>{user?.address || "your physical address"}</strong><br/>
              It should arrive in 3-5 business days.
            </p>
            <Button onClick={handlePostcard} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send Postcard</Button>
            <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5" onClick={() => setVerifyMethod('select')}>
              Back
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
            <FileText className="mr-2 h-5 w-5 text-amber-500" />
            Document Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Please upload a photo of a document showing your name and address in <strong>{user?.district}</strong> (e.g., utility bill, lease agreement, bank statement).
          </p>
          
          <div className="border-2 border-dashed border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 rounded-lg p-6 text-center">
            <input
              type="file"
              id="doc-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*,.pdf"
            />
            <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-8 w-8 text-slate-600 dark:text-slate-400 mb-2" />
              <span className="text-sm font-bold text-amber-500">
                {file ? file.name : 'Click to select document'}
              </span>
            </label>
          </div>
          
          <Button 
             className="w-full bg-amber-600 hover:bg-amber-700 text-white"
             disabled={!file || uploadStatus === 'uploading'}
            onClick={handleUpload}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit for Review'}
          </Button>
          
          <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-black/5 dark:bg-white/5" onClick={() => setVerifyMethod('select')}>
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative group rounded-xl overflow-hidden">
      <div className="opacity-40 pointer-events-none blur-sm select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-[2px] p-4 text-center">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl max-w-sm border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unverified Address</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Access to the community is limited. Verify your address to fully participate in discussions and view neighbor content.
          </p>
          <Button onClick={() => setIsVerifying(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Verify Address
          </Button>
        </div>
      </div>
    </div>
  );
}

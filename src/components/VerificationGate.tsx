import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, ShieldCheck, Upload, Navigation, Clock, Smartphone, FileText, Mail } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { useAddressVerification } from '../hooks/useAddressVerification';
import { useVerificationStore } from '../store/useVerificationStore';

export default function VerificationGate({ children, compact = false }: { children: React.ReactNode, compact?: boolean }) {
  const { user, verifyLocation, addLocation } = useAuthStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const { addRequest, requests } = useVerificationStore();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'pending'>('idle');

  // Address form fields if there are no locations
  const [newStreet, setNewStreet] = useState('');
  const [newBuilding, setNewBuilding] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newDistrict, setNewDistrict] = useState('Sabail');

  const {
    method: verifyMethod,
    setMethod: setVerifyMethod,
    gpsStatus,
    gpsError,
    handleGPSVerification,
    phone,
    setPhone,
    smsCode,
    setSmsCode,
    smsError,
    handleSmsVerification,
    sendSmsCode,
    generatedSmsCode,
    file,
    setFile,
  } = useAddressVerification((verified) => {
    if (verified) {
      verifyLocation(user?.activeLocationId || 'loc-home', verifyMethod);
    }
  });

  // Check if there is an active request in pending state for the current user
  const hasPendingRequest = requests.some(r => r.userId === user?.uid && r.status === 'pending');

  // Auto-pass if already verified
  if (user?.trust_level && user.trust_level >= 2) {
    return <>{children}</>;
  }
  
  // Also pass for backwards compatibility if they are legacy verified
  if (user?.is_verified) {
    return <>{children}</>;
  }

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploadStatus('uploading');
    
    setTimeout(() => {
      addRequest({
        userId: user.uid,
        name: user.name,
        district: user.district || 'Sabail',
        documentUrl: URL.createObjectURL(file),
        locationId: user.activeLocationId || 'loc-home'
      });
      setUploadStatus('pending');
    }, 1500);
  };

  const handlePostcard = () => {
    setUploadStatus('pending'); 
  };

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newBuilding || !newApartment) {
      alert('Please fill out all address fields');
      return;
    }
    addLocation({
      type: 'HOME',
      name: 'Home Address',
      district: newDistrict,
      address: `${newStreet}, Bldg ${newBuilding}, Apt ${newApartment}`,
      country: user?.country || 'Azerbaijan',
      city: user?.city || 'Baku',
    });
  };

  if (uploadStatus === 'pending' || hasPendingRequest) {
    return (
      <Card className="glass-panel text-center border-black/10 dark:border-white/10 shadow-2xl p-6">
        <CardContent className="pt-6">
          <Clock className="mx-auto h-12 w-12 text-orange-400 mb-4 animate-pulse" />
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

  const hasLocations = user?.locations && user.locations.length > 0;

  if (isVerifying) {
    if (!hasLocations) {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <MapPin className="mr-2 h-5 w-5 text-indigo-500" />
              Add Your Address First
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLocationSubmit} className="space-y-4 text-left">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You have no addresses registered. Please enter your physical address before verifying.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">District</label>
                <select 
                  value={newDistrict} 
                  onChange={e => setNewDistrict(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="Sabail">Sabail</option>
                  <option value="Nasimi">Nasimi</option>
                  <option value="Yasamal">Yasamal</option>
                  <option value="Narimanov">Narimanov</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Street</label>
                <Input type="text" placeholder="e.g. Nizami St" value={newStreet} onChange={e => setNewStreet(e.target.value)} className="bg-white dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Building</label>
                  <Input type="text" placeholder="e.g. 42" value={newBuilding} onChange={e => setNewBuilding(e.target.value)} className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Apartment</label>
                  <Input type="text" placeholder="e.g. 15" value={newApartment} onChange={e => setNewApartment(e.target.value)} className="bg-white dark:bg-slate-800" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsVerifying(false)} className="w-1/3 text-slate-500">Cancel</Button>
                <Button type="submit" className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white">Save Address</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    if (verifyMethod === 'select') {
      return (
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl max-w-xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <ShieldCheck className="mr-2 h-5 w-5 text-indigo-500" />
              Become a Verified Resident
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm text-left">
              <p className="mb-2"><strong>Unlock your neighborhood community.</strong></p>
              <p>Verify that you belong to a real neighborhood. We securely process verification data strictly to ensure everyone here actually lives here.</p>
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
              We need access to your device's location to confirm you are in <strong>your neighborhood</strong>.
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
              Enter your phone number. The number must be registered to your name and address.
            </p>
            <div className="flex gap-2">
              <Input type="tel" placeholder="+994..." value={phone} onChange={e => setPhone(e.target.value)} className="bg-white dark:bg-slate-800 flex-1" />
              <Button type="button" size="sm" variant="outline" onClick={sendSmsCode} disabled={phone.length < 8}>
                Send Code
              </Button>
            </div>
            
            {generatedSmsCode && (
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="Enter the 4-digit code sent to your phone" 
                  value={smsCode} 
                  onChange={e => setSmsCode(e.target.value)} 
                  className="bg-white dark:bg-slate-800" 
                />
                <p className="text-xs text-indigo-500 font-medium">Tip: Use the code simulated in the SMS alert dialogue.</p>
              </div>
            )}
            
            {smsError && <p className="text-sm text-red-500">{smsError}</p>}
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSmsVerification}
              disabled={!generatedSmsCode}
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
              <strong>your physical address</strong><br/>
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
            Please upload a photo of a document showing your name and address (e.g., utility bill, lease agreement, bank statement).
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

  
  const isGuest = user?.role === 'guest';

  if (compact) {
    return (
      <div className="relative group rounded-xl overflow-hidden mt-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {isGuest ? (
            <button onClick={() => navigate('/auth')} className="text-indigo-600 hover:underline font-bold">Sign in</button>
          ) : (
            <button onClick={() => setIsVerifying(true)} className="text-indigo-600 hover:underline font-bold">Verify location</button>
          )}
          <span> to interact</span>
        </div>
      </div>
    );
  }

  return (

    <div className="relative group rounded-xl overflow-hidden">
      <div className="opacity-40 pointer-events-none blur-sm select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-[2px] p-4 text-center">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl max-w-sm border border-slate-200 dark:border-slate-800">
          
          {isGuest ? (
             <>
               <ShieldCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('guest.create_account', language)}</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                 {t('verify.guest_desc', language)}
               </p>
               <Button onClick={() => navigate('/auth')} className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900">
                 Create Account
               </Button>
             </>
          ) : (
            <>
              <ShieldCheck className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Become a Verified Resident</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                You are currently a Registered User. Verify your location to unlock publishing, chatting, and voting.
              </p>
              <Button onClick={() => setIsVerifying(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Verify Address
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

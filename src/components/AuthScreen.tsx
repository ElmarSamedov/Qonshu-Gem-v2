import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, X, FileText, Camera, Smartphone, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import LanguageSelector from './LanguageSelector';

export default function AuthScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [realName, setRealName] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const [district, setDistrict] = useState('Nasimi');
  const [streetAddress, setStreetAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'geo' | 'docs' | 'postcard' | ''>('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [documentUploaded, setDocumentUploaded] = useState(false);
  
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const { language } = useLanguageStore();

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName || realName.trim().split(' ').length < 2) {
      setError('Please enter your full real name');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress || !buildingNumber) {
      setError('Please provide your full physical address. P.O. Boxes are not accepted.');
      return;
    }
    if (streetAddress.toLowerCase().includes('p.o. box') || streetAddress.toLowerCase().includes('po box')) {
      setError('P.O. Boxes are not accepted. Please provide a physical address.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleVerificationSelect = (method: 'sms' | 'geo' | 'docs' | 'postcard') => {
    setVerificationMethod(method);
    setError('');
  };

  const handleCompleteRegistration = async (isVerified: boolean) => {
    try {
      const fullAddress = `${streetAddress}, Bldg ${buildingNumber}${apartmentNumber ? `, Apt ${apartmentNumber}` : ''}`;
      await login(email, password, realName, district, fullAddress, avatar, isVerified);
    } catch (err) {
      setError('An error occurred during registration.');
    }
  };

  const handleSkipVerification = () => {
    handleCompleteRegistration(false);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto relative">
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80&fit=crop" 
          alt="Neighbors Welcome" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSelector />
        </div>
        
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md glass-panel border-white/20 shadow-2xl relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <span className="text-2xl font-bold">Q</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {step === 1 && "Create Account"}
                {step === 2 && "Your Profile"}
                {step === 3 && "Where do you live?"}
                {step === 4 && "Verify your address"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Continue with Email
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button type="button" variant="outline" className="w-full">Google</Button>
                    <Button type="button" variant="outline" className="w-full">Facebook</Button>
                    <Button type="button" variant="outline" className="w-full">Apple</Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleProfile} className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm flex gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <p>Real names only. We require real names to ensure accountability and trust in the neighborhood. Fake names are blocked and may require manual verification.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Real Name</label>
                    <Input
                      type="text"
                      placeholder="First and Last Name"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className="h-6 w-6 text-slate-400" />}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=' + realName)}>
                        Add Photo
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">You can add it now or later in your profile.</p>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">Back</Button>
                    <Button type="submit" className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white">Continue</Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleAddress} className="space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg text-sm flex gap-2">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <p>The system requires your full physical address. <strong>Your exact address is hidden from neighbors</strong>, only your neighborhood name is visible.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-10 px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Nasimi">Nasimi</option>
                      <option value="Yasamal">Yasamal</option>
                      <option value="Sabail">Sabail</option>
                      <option value="Narimanov">Narimanov</option>
                      <option value="Khatai">Khatai</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Nizami St"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Building No.</label>
                      <Input
                        type="text"
                        placeholder="e.g. 42"
                        value={buildingNumber}
                        onChange={(e) => setBuildingNumber(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Apt / Unit (Optional)</label>
                      <Input
                        type="text"
                        placeholder="e.g. 15"
                        value={apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3">Back</Button>
                    <Button type="submit" className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white">Continue</Button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    To keep Qonşu secure, we need to verify you live at this address. Please choose a verification method. 
                    In accordance with Azerbaijani law, your data is securely processed only for neighborhood verification.
                  </div>

                  {!verificationMethod ? (
                    <div className="space-y-3">
                      <button onClick={() => handleVerificationSelect('sms')} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mr-4">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Phone Verification</div>
                          <div className="text-xs text-slate-500">SMS code sent to number matching your address</div>
                        </div>
                      </button>

                      <button onClick={() => handleVerificationSelect('geo')} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mr-4">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Geolocation</div>
                          <div className="text-xs text-slate-500">Instant verify if you are currently at home</div>
                        </div>
                      </button>

                      <button onClick={() => handleVerificationSelect('docs')} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 mr-4">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Document Upload</div>
                          <div className="text-xs text-slate-500">Utility bill, lease, or bank statement</div>
                        </div>
                      </button>

                      <button onClick={() => handleVerificationSelect('postcard')} className="w-full flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 mr-4">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">Postcard</div>
                          <div className="text-xs text-slate-500">Mail with verification code sent to your address</div>
                        </div>
                      </button>
                      
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Button variant="ghost" onClick={handleSkipVerification} className="w-full text-slate-500">
                          Skip for now (Limited Access)
                        </Button>
                        <p className="text-xs text-center text-slate-400 mt-2">
                          Without verification, you cannot fully participate in discussions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {verificationMethod === 'sms' && (
                        <div className="space-y-4">
                          <p className="text-sm text-slate-700 dark:text-slate-300">Enter your phone number. The number must be registered to your name and address.</p>
                          <Input type="tel" placeholder="+994" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white dark:bg-slate-800" />
                          {phone.length > 8 && (
                            <Input type="text" placeholder="SMS Code (try 1234)" value={smsCode} onChange={e => setSmsCode(e.target.value)} className="bg-white dark:bg-slate-800" />
                          )}
                          <Button onClick={() => {
                            if (smsCode === '1234') handleCompleteRegistration(true);
                            else setError('Invalid code. Use 1234.');
                          }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Verify Phone</Button>
                        </div>
                      )}

                      {verificationMethod === 'geo' && (
                        <div className="space-y-4 text-center py-4">
                          <div className="animate-pulse flex justify-center mb-4">
                            <MapPin className="h-12 w-12 text-indigo-500" />
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">Allow location access to verify you are currently at home.</p>
                          <Button onClick={() => handleCompleteRegistration(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Share Location & Verify</Button>
                        </div>
                      )}

                      {verificationMethod === 'docs' && (
                        <div className="space-y-4">
                          <p className="text-sm text-slate-700 dark:text-slate-300">Upload a photo of an official document confirming your residence (utility bill, lease agreement, bank statement, etc.).</p>
                          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setDocumentUploaded(true)}>
                            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {documentUploaded ? "Document selected (document.jpg)" : "Click to select document"}
                            </span>
                          </div>
                          <Button disabled={!documentUploaded} onClick={() => handleCompleteRegistration(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Upload & Verify</Button>
                        </div>
                      )}

                      {verificationMethod === 'postcard' && (
                        <div className="space-y-4 text-center py-4">
                          <Mail className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                          <p className="text-sm text-slate-700 dark:text-slate-300">We will send a postcard with a verification code to:<br/><strong>{streetAddress}, {buildingNumber}{apartmentNumber ? `, Apt ${apartmentNumber}` : ''}</strong><br/>It should arrive in 3-5 business days.</p>
                          <Button onClick={() => handleCompleteRegistration(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Send Postcard</Button>
                        </div>
                      )}

                      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                      <Button variant="ghost" onClick={() => setVerificationMethod('')} className="w-full text-slate-500 mt-2">
                        Choose different method
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

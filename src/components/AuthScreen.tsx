import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Camera, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

export default function AuthScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Azerbaijan');
  const [city, setCity] = useState('Baku');
  const [town, setTown] = useState('Sabail');
  const [district, setDistrict] = useState('Sabail');
  const [street, setStreet] = useState('Nizami St');
  const [building, setBuilding] = useState('42');
  const [entrance, setEntrance] = useState('2');
  const [apartment, setApartment] = useState('15');
  const [phone, setPhone] = useState('+994501234567');
  const [avatar, setAvatar] = useState('');
  
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !country || !city || !street || !building || !apartment) {
      setError('Please fill out all required fields');
      return;
    }
    setError('');
    const fullName = `${firstName} ${lastName}`;
    await login(email, password, fullName, {
      country,
      city,
      town,
      district,
      street,
      building,
      entrance,
      apartment,
      phone
    });
    navigate('/');
  };

  const handleSocialLogin = async (provider: string) => {
    setError('');
    try {
      if (provider === 'Google') {
        await useAuthStore.getState().loginWithGoogle();
        navigate('/');
      } else {
        alert(`${provider} login is not supported yet.`);
      }
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    }
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
        <div className="absolute top-4 right-4 z-20 flex gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate('/welcome')}>Back</Button>
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
                {step === 2 && "Welcome! Let's create your profile."}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email or Phone</label>
                    <Input
                      type="text"
                      placeholder="you@example.com or +994..."
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
                    Continue with Email/Phone
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or sign in with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button type="button" variant="outline" onClick={() => handleSocialLogin('Google')} className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">Google</Button>
                    <Button type="button" variant="outline" onClick={() => handleSocialLogin('Facebook')} className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">Facebook</Button>
                    <Button type="button" variant="outline" onClick={() => handleSocialLogin('Apple')} className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">Apple</Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                      <Input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                    <Input
                      type="text"
                      placeholder="+994501234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                      <Input
                        type="text"
                        placeholder="e.g. Azerbaijan"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                      <Input
                        type="text"
                        placeholder="e.g. Baku"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Town</label>
                      <Input
                        type="text"
                        placeholder="Sabail"
                        value={town}
                        onChange={(e) => setTown(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
                      <Input
                        type="text"
                        placeholder="Sabail"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street</label>
                    <Input
                      type="text"
                      placeholder="e.g. Nizami St"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Building</label>
                      <Input
                        type="text"
                        placeholder="42"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="bg-white dark:bg-slate-800 text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Entrance</label>
                      <Input
                        type="text"
                        placeholder="2"
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                        className="bg-white dark:bg-slate-800 text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Apartment</label>
                      <Input
                        type="text"
                        placeholder="15"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="bg-white dark:bg-slate-800 text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className="h-6 w-6 text-slate-400" />}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=' + firstName)}>
                        Add Photo
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">You can add it now or later.</p>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">Back</Button>
                    <Button type="submit" className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white">Complete Registration</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

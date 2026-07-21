import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PhoneCall, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export default function EmergencyContact() {
  const { user, updateUser } = useAuthStore();
  const { language } = useLanguageStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.emergencyContactName || '');
  const [phone, setPhone] = useState(user?.emergencyContactPhone || '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateUser({
      emergencyContactName: name,
      emergencyContactPhone: phone
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 border-b border-black/10 dark:border-white/10">
      <div className="pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg text-slate-900 dark:text-white">Emergency Contact</CardTitle>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add a trusted contact in case of an emergency. This is securely linked to your trust profile.
        </p>
      </div>
      <div className="pt-4 space-y-4">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div>
              {user.emergencyContactName ? (
                <>
                  <p className="font-semibold text-slate-900 dark:text-white">{user.emergencyContactName}</p>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <PhoneCall className="w-3 h-3 mr-1" />
                    {user.emergencyContactPhone}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">No emergency contact set.</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              {user.emergencyContactName ? 'Edit' : 'Add Contact'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Contact Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. John Doe (Brother)"
                className="bg-white/40 dark:bg-black/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Phone Number</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. +994 50 123 45 67"
                className="bg-white/40 dark:bg-black/20"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => {
                setName(user?.emergencyContactName || '');
                setPhone(user?.emergencyContactPhone || '');
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white">
                Save Contact
              </Button>
            </div>
          </div>
        )}
        
        {saved && (
          <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Emergency contact updated securely.</span>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Car, Plus, X } from 'lucide-react';

const COUNTRIES = [
  'Azerbaijan', 'Turkey', 'Georgia', 'Russia', 'Ukraine', 'Iran', 
  'Kazakhstan', 'Uzbekistan', 'Transit Numbers', 'European Union Numbers', 
  'Kyrgyzstan', 'Turkmenistan'
];

export default function CarNumbers() {
  const { user, updateUser } = useAuthStore();
  const [adding, setAdding] = useState(false);
  const [country, setCountry] = useState('Azerbaijan');
  const [number, setNumber] = useState('');

  const cars = user?.cars || [];

  const handleAdd = () => {
    if (cars.length >= 2) return;
    if (!number) return;
    
    updateUser({
      cars: [...cars, { country, number }]
    });
    setAdding(false);
    setNumber('');
  };

  const handleRemove = (index: number) => {
    const newCars = [...cars];
    newCars.splice(index, 1);
    updateUser({ cars: newCars });
  };

  const getPlaceholder = (c: string) => {
    switch(c) {
      case 'Azerbaijan': return '99-XX-999';
      case 'Turkey': return '34 ABC 123';
      case 'Georgia': return 'AB-123-CD';
      case 'Russia': return 'A 123 BC 77';
      default: return 'Enter plate number';
    }
  };

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
      <CardHeader className="border-b border-black/10 dark:border-white/5 pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-indigo-400" />
          <CardTitle className="text-lg text-slate-900 dark:text-white">Vehicles</CardTitle>
        </div>
        {cars.length < 2 && !adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {cars.map((car, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{car.country}</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">{car.number}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {cars.length === 0 && !adding && (
          <p className="text-sm text-slate-500 text-center py-4">No vehicles added.</p>
        )}

        {adding && (
          <div className="space-y-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div>
              <label className="text-xs font-medium text-slate-500">Country</label>
              <select 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                className="w-full mt-1 bg-transparent border-b border-black/20 dark:border-white/20 text-sm py-1 outline-none focus:border-indigo-500"
              >
                {COUNTRIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Plate Number</label>
              <Input 
                value={number}
                onChange={e => setNumber(e.target.value.toUpperCase())}
                placeholder={getPlaceholder(country)}
                className="mt-1 font-mono uppercase bg-black/5 dark:bg-white/5 border-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAdd} className="bg-indigo-500 text-white hover:bg-indigo-600">Save</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

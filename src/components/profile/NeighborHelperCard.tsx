import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Heart, QrCode, Phone, Printer } from 'lucide-react';
import { Button } from '../ui/button';

export default function NeighborHelperCard() {
  const [neighborName, setNeighborName] = useState('');
  const [generated, setGenerated] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mt-6 print:shadow-none print:border-none print:m-0 print:p-0">
      <CardHeader className="border-b border-white/5 pb-4 print:hidden">
        <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Neighbor Helper Card
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Help an elderly neighbor by generating a simplified physical access card for them.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {!generated ? (
          <div className="space-y-4 print:hidden">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Neighbor's Name</label>
              <input
                type="text"
                value={neighborName}
                onChange={(e) => setNeighborName(e.target.value)}
                placeholder="e.g. Grandma Leyla"
                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <Button onClick={() => setGenerated(true)} disabled={!neighborName} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
              Generate Access Card
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-8 border-4 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg text-3xl font-bold text-white">
                Q
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{neighborName}'s Neighborhood Card</h3>
                <p className="text-sm text-slate-500 mt-2">Scan this code with any smartphone camera to instantly access the neighborhood board.</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-100">
                <QrCode className="w-32 h-32 text-black" />
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Neighborhood Hotline</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">*8899</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 print:hidden">
              <Button onClick={() => setGenerated(false)} variant="outline" className="w-1/3">
                Back
              </Button>
              <Button onClick={handlePrint} className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                <Printer className="w-4 h-4" /> Print Card
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

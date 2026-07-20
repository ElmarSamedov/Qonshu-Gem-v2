import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, Search, Calendar, ShoppingBag } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function GuestWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80&fit=crop" 
          alt="Neighborhood" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
          <span className="text-4xl font-bold">Q</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Welcome to Qonşu.
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-lg">
          Discover what's happening around you.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-lg w-full mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-white">
            <Search className="h-6 w-6 mb-2 text-blue-400" />
            <span className="text-sm font-medium">Local Feeds</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-white">
            <Calendar className="h-6 w-6 mb-2 text-green-400" />
            <span className="text-sm font-medium">Public Events</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-white">
            <ShoppingBag className="h-6 w-6 mb-2 text-orange-400" />
            <span className="text-sm font-medium">Marketplace</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-white">
            <MapPin className="h-6 w-6 mb-2 text-purple-400" />
            <span className="text-sm font-medium">Neighborhoods</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            className="flex-1 bg-white hover:bg-slate-100 text-slate-900 text-lg h-14 rounded-xl font-semibold shadow-xl"
            onClick={() => navigate('/feed')}
          >
            Explore Nearby
          </Button>
          <Button 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-lg h-14 rounded-xl font-semibold shadow-xl"
            onClick={() => navigate('/auth')}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tag, MapPin, Plus, X, HandHeart, RefreshCw, Flag, Eye, ThumbsUp } from 'lucide-react';
import { useModerationStore } from '../store/useModerationStore';
import VerificationGate from './VerificationGate';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';

export default function Marketplace() {
  const { addReport } = useModerationStore();
  const { language } = useLanguageStore();
  const [items, setItems] = useState([
    { id: 1, title: 'IKEA Office Chair', type: 'sell', price: '45 ₼', category: 'Furniture', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop', distance: '100m', distanceNum: 100, views: 12, helpful: 3 },
    { id: 2, title: 'Bicycle (Adult)', type: 'sell', price: '120 ₼', category: 'Sports', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop', distance: '300m', distanceNum: 300, views: 45, helpful: 8 },
    { id: 3, title: 'Moving Boxes', type: 'giveaway', price: 'Free', category: 'Other', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=300&fit=crop', distance: '50m', distanceNum: 50, views: 8, helpful: 1 },
    { id: 4, title: 'Power Drill', type: 'lend', price: 'Lend', category: 'Tools', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop', distance: '400m', distanceNum: 400, views: 32, helpful: 5 },
  ]);
  const [filter, setFilter] = useState('closest');
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'giveaway',
    category: 'Tools',
    price: '',
  });

  const categories = ['Tools', 'Books', 'Food', 'Furniture', 'Sports', 'Other'];
  const types = [
    { id: 'giveaway', label: t('market.giveaway', language), icon: <HandHeart className="h-4 w-4 mr-2" /> },
    { id: 'lend', label: t('market.lend', language), icon: <RefreshCw className="h-4 w-4 mr-2" /> },
    { id: 'sell', label: t('market.sell', language), icon: <Tag className="h-4 w-4 mr-2" /> },
  ];

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;
    
    setItems([
      {
        id: items.length + 1,
        title: newItem.title,
        type: newItem.type,
        price: newItem.price || 'Free',
        category: newItem.category,
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
        distance: '0m',
        distanceNum: 0,
        views: 0,
        helpful: 0
      },
      ...items
    ]);
    setShowForm(false);
    setNewItem({ title: '', type: 'giveaway', category: 'Tools', price: '' });
  };

  const handleItemClick = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, views: item.views + 1 } : item));
  };

  const handleHelpfulClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setItems(items.map(item => item.id === id ? { ...item, helpful: item.helpful + 1 } : item));
  };

  const sortedItems = [...items].sort((a, b) => {
    if (filter === 'closest') return a.distanceNum - b.distanceNum;
    if (filter === 'helpful') return b.helpful - a.helpful;
    if (filter === 'category') return a.category.localeCompare(b.category);
    if (filter === 'alphabetical') return a.title.localeCompare(b.title);
    if (filter === 'viewed') return b.views - a.views;
    if (filter === 'cost') {
      const getPrice = (priceStr: string) => {
        if (priceStr.toLowerCase() === 'free' || priceStr.toLowerCase() === 'lend') return 0;
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      };
      return getPrice(a.price) - getPrice(b.price);
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('market.title', language)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('market.subtitle', language)}</p>
        </div>
        <select 
          className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-md text-sm px-2 py-1 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="closest">Closest to furthest</option>
          <option value="helpful">Most helpful first</option>
          <option value="viewed">Most viewed</option>
          <option value="cost">By cost (Low to High)</option>
          <option value="category">By category</option>
          <option value="alphabetical">Alphabetically</option>
        </select>
      </div>
      <VerificationGate>
        {!showForm ? (
          <Card className="glass-panel border-dashed border-2 border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 shadow-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">{t('market.have_something', language)}</h3>
              <Button onClick={() => setShowForm(true)} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-blue-500/20">
                <Plus className="mr-2 h-4 w-4" /> {t('market.create', language)}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-black/20 dark:border-white/20 bg-white/60 dark:bg-black/40 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-slate-900 dark:text-white">{t('market.new_listing', language)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('market.type', language)}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {types.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setNewItem({...newItem, type: opt.id})}
                        className={`flex items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all ${
                          newItem.type === opt.id 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                            : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5'
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('market.category', language)}</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewItem({...newItem, category: cat})}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          newItem.category === cat 
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                            : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5 hover:text-slate-900 dark:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('market.item_name', language)}</label>
                  <Input 
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g., Power Drill, Mathematics Book"
                    className="bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"
                    required
                  />
                </div>

                {newItem.type === 'sell' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('market.price', language)}</label>
                    <Input 
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="Amount"
                      className="bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                  {t('market.list_item', language)}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </VerificationGate>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {sortedItems.map(item => (
          <Card key={item.id} onClick={() => handleItemClick(item.id)} className="glass-panel overflow-hidden group cursor-pointer border-black/10 dark:border-white/10 hover:shadow-xl transition-all relative">
            <div className="absolute top-2 right-2 z-10 flex space-x-1">
              <div className="px-2 py-1 rounded bg-white/80 dark:bg-black/60 backdrop-blur border border-black/10 dark:border-white/10 text-[10px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {item.category}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  addReport({ type: 'listing', contentId: item.id, content: item.title, author: 'Anonymous', reason: 'Flagged by user' });
                }}
              >
                <Flag className="h-3 w-3" />
              </Button>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
            </div>
            <CardContent className="p-4 bg-black/5 dark:bg-white/5 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">{item.title}</h3>
                <span className={`text-sm font-bold whitespace-nowrap ${
                  item.type === 'giveaway' ? 'text-green-400' : 
                  item.type === 'lend' ? 'text-blue-400' : 'text-orange-400'
                }`}>
                  {item.price}
                </span>
              </div>
              <div className="mt-2 flex flex-col space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex items-center">
                    {item.type === 'lend' ? <RefreshCw className="h-3 w-3 mr-1 text-blue-400" /> :
                     item.type === 'giveaway' ? <HandHeart className="h-3 w-3 mr-1 text-green-400" /> :
                     <Tag className="h-3 w-3 mr-1 text-orange-400" />}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span className="flex items-center"><Eye className="h-3 w-3 mr-1"/> {item.views}</span>
                    <button onClick={(e) => handleHelpfulClick(e, item.id)} className="flex items-center hover:text-blue-500 transition-colors">
                      <ThumbsUp className="h-3 w-3 mr-1"/> {item.helpful}
                    </button>
                  </div>
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.distance} {t('aid.away', language)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// Imports
content = content.replace(
  "import { Settings, LogOut, Shield, MapPin, Building, Globe, Bell, Moon, Sun, Monitor, Type, AlertTriangle, MessageCircle, Store, Calendar, Image as ImageIcon } from 'lucide-react';",
  "import { Settings, LogOut, Shield, MapPin, Building, Globe, Bell, Moon, Sun, Monitor, Type, AlertTriangle, MessageCircle, Store, Calendar, Image as ImageIcon, Search, UserPlus, Wifi, Check, X } from 'lucide-react';"
);

// Add state for neighbors and router code
content = content.replace(
  'const { seniorMode, toggleSeniorMode } = useSettingsStore();',
  `const { seniorMode, toggleSeniorMode } = useSettingsStore();
  const [searchPhone, setSearchPhone] = useState('');
  const [addedNeighbors, setAddedNeighbors] = useState([
    { id: 1, name: 'Aysel H.', phone: '+994501234567', distance: '10m (Next door)' },
    { id: 2, name: 'Kamran B.', phone: '+994559876543', distance: '30m (Same floor)' }
  ]);
  const [routerCode, setRouterCode] = useState('MyWiFi_Guest / Pass: qonsu123');
  const [isEditingRouter, setIsEditingRouter] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    if (searchPhone === '+994501112233') {
      setSearchResult({ id: 3, name: 'Tural S.', phone: '+994501112233', distance: '15m (Downstairs)' });
    } else {
      alert('Neighbor not found in your neighborhood.');
      setSearchResult(null);
    }
  };

  const handleAddNeighbor = () => {
    if (searchResult) {
      setAddedNeighbors([...addedNeighbors, searchResult]);
      setSearchResult(null);
      setSearchPhone('');
    }
  };`
);

// Add the UI components inside the return statement, before "Notification Preferences"
const customHtml = `
          {/* Router Code */}
          <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">My Router Code</CardTitle>
              </div>
              <p className="text-xs text-slate-500 mt-1">Visible only to your immediate neighbors (within 50m).</p>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {isEditingRouter ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input 
                      type="text" 
                      value={routerCode} 
                      onChange={(e) => setRouterCode(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={() => setIsEditingRouter(false)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="font-mono text-sm text-slate-800 dark:text-slate-200">
                      {routerCode}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingRouter(true)}>Edit</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Added Neighbors */}
          <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-lg text-slate-900 dark:text-white">My Neighbors</CardTitle>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Add neighbors manually by phone number to share router codes and closer updates.</p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search phone (e.g. +994501112233)"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4">Search</Button>
              </div>

              {searchResult && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{searchResult.name}</p>
                    <p className="text-xs text-slate-500">{searchResult.distance}</p>
                  </div>
                  <Button size="sm" onClick={handleAddNeighbor} className="bg-green-500 hover:bg-green-600 text-white rounded-lg">Add</Button>
                </div>
              )}

              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Added Neighbors</h4>
                {addedNeighbors.map(n => (
                  <div key={n.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{n.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{n.distance}</p>
                    </div>
                    <button className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
`;

content = content.replace(
  '{/* Notification Preferences */}',
  customHtml + '\n          {/* Notification Preferences */}'
);

fs.writeFileSync('src/components/Profile.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/profile/MyNeighbors.tsx', 'utf8');

const target = `<div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('profile.search_phone', language) || "Search phone (e.g. +994501112233)"}
              className="w-full pl-9 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !searchPhone.trim()} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {isSearching ? 'Searching...' : (t('profile.search', language) || 'Search')}
          </Button>
        </div>
        
        {searchResult && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">{isGuest ? t('common.neighbor', language) : searchResult.name}</p>
              {!isGuest && <p className="text-xs text-emerald-600 dark:text-emerald-400">{searchResult.distance}</p>}
            </div>
            <Button size="sm" onClick={handleAddNeighbor} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {t('profile.add', language) || 'Add'}
            </Button>
          </div>
        )}`;

const replacement = `{false && (
          <>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t('profile.search_phone', language) || "Search phone (e.g. +994501112233)"}
                  className="w-full pl-9 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchPhone.trim()} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                {isSearching ? 'Searching...' : (t('profile.search', language) || 'Search')}
              </Button>
            </div>
            
            {searchResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                <div>
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">{isGuest ? t('common.neighbor', language) : searchResult.name}</p>
                  {!isGuest && <p className="text-xs text-emerald-600 dark:text-emerald-400">{searchResult.distance}</p>}
                </div>
                <Button size="sm" onClick={handleAddNeighbor} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  {t('profile.add', language) || 'Add'}
                </Button>
              </div>
            )}
          </>
        )}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/profile/MyNeighbors.tsx', content);
  console.log("Replaced successfully");
} else {
  console.log("Target not found!");
}

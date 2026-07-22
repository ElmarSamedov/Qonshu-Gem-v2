const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const oldFilters = `<div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setLocationFilter('all')}
          className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
        >
          All Posts
        </button>
        <button 
          onClick={() => setLocationFilter('building')}
          className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'building' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
        >{t('common.building', language)}</button>
        <button 
          onClick={() => setLocationFilter('neighborhood')}
          className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'neighborhood' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
        >{t('common.neighborhood', language)}</button>
      </div>`;

const newFilters = `<div className="flex items-center justify-between pb-2">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setLocationFilter('all')}
            className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
          >
            All Posts
          </button>
          <button 
            onClick={() => setLocationFilter('building')}
            className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'building' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
          >{t('common.building', language)}</button>
          <button 
            onClick={() => setLocationFilter('neighborhood')}
            className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap \${locationFilter === 'neighborhood' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}\`}
          >{t('common.neighborhood', language)}</button>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/5 dark:border-white/5 ml-2 shrink-0">
          <button 
            onClick={() => setFeedView('list')}
            className={\`p-1.5 rounded-full transition-all \${feedView === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}\`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setFeedView('map')}
            className={\`p-1.5 rounded-full transition-all \${feedView === 'map' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}\`}
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>`;

content = content.replace(oldFilters, newFilters);

const oldListStart = `<div className="space-y-4">
        {visiblePosts.map(post => (`;

const newListStart = `{feedView === 'map' ? (
        <StreetMap posts={visiblePosts} />
      ) : (
      <div className="space-y-4">
        {visiblePosts.map(post => (`;

content = content.replace(oldListStart, newListStart);

const oldListEnd = `        ))}
      </div>`;

const newListEnd = `        ))}
      </div>
      )}`;

content = content.replace(oldListEnd, newListEnd);

fs.writeFileSync('src/components/Feed.tsx', content);

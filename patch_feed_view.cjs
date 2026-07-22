const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
  "import NeighborhoodPulse from './NeighborhoodPulse';",
  "import NeighborhoodPulse from './NeighborhoodPulse';\nimport StreetMap from './StreetMap';\nimport { Map as MapIcon, List as ListIcon } from 'lucide-react';"
);

content = content.replace(
  "const [locationFilter, setLocationFilter] = useState<'all' | 'building' | 'neighborhood'>('all');",
  "const [locationFilter, setLocationFilter] = useState<'all' | 'building' | 'neighborhood'>('all');\n  const [feedView, setFeedView] = useState<'list' | 'map'>('list');"
);

const newFilterSection = `{/* Filters */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {['all', 'building', 'neighborhood'].map(filter => (
            <button
              key={filter}
              onClick={() => setLocationFilter(filter as any)}
              className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap \${
                locationFilter === filter
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }\`}
            >
              {t(\`feed.\${filter}\`, language)}
            </button>
          ))}
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

content = content.replace(
  /\{\/\* Filters \*\/\}.*?(?=\{\/\* Posts List \*\/\})/s,
  newFilterSection + "\n\n      "
);

const newPostsSection = `{/* Posts List */}
      {feedView === 'map' ? (
        <StreetMap posts={posts} />
      ) : (
        <div className="space-y-4">
          {posts.filter(p => locationFilter === 'all' || p.locationScope === locationFilter).map((post, index) => (
            <PostCard 
              key={post.id} 
              post={post} 
              index={index} 
              user={user} 
              isGuest={isGuest} 
              language={language}
              expandedComments={expandedComments}
              setExpandedComments={setExpandedComments}
              commentInputs={commentInputs}
              setCommentInputs={setCommentInputs}
              handleAddComment={handleAddComment}
              handleLikePost={handleLikePost}
              addReport={addReport}
            />
          ))}
        </div>
      )}`;

content = content.replace(
  /\{\/\* Posts List \*\/\}\s*<div className="space-y-4">.*?<\/div>\s*(?=\{\/\* Moments Viewer \*\/\})/s,
  newPostsSection + "\n\n      "
);

fs.writeFileSync('src/components/Feed.tsx', content);

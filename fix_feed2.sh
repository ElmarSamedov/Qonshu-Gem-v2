sed -i '/const \[locationFilter, setLocationFilter\] = useState/a\
  const [postAnonymously, setPostAnonymously] = useState(false);' src/components/Feed.tsx

sed -i '/const newPost = {/a\
      id: Date.now(),\
      author: postAnonymously ? '\''Anonymous'\'' : (user?.isAnonymous ? '\''Anonymous'\'' : (user?.name || '\''You'\'')),\
      avatar: postAnonymously ? null : (user?.isAnonymous ? null : (user?.avatar || null)),' src/components/Feed.tsx

sed -i '/const newPost = {/,/avatar: /d' src/components/Feed.tsx

sed -i '/setPostDraftImage(null);/a\
    setPostAnonymously(false);' src/components/Feed.tsx

sed -i '/<div className="flex items-center justify-between mb-4">/i\
            <div className="flex items-center space-x-2 mb-4">\
              <input type="checkbox" id="anon-post" checked={postAnonymously} onChange={(e) => {\
                if(e.target.checked) {\
                  if(confirm('\''Post anonymously for a $1 one-time fee?'\'')) setPostAnonymously(true);\
                } else {\
                  setPostAnonymously(false);\
                }\
              }} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />\
              <label htmlFor="anon-post" className="text-sm text-slate-600 dark:text-slate-400">Post anonymously ($1 fee)</label>\
            </div>' src/components/Feed.tsx

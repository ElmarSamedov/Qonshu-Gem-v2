sed -i '/const \[locationFilter, setLocationFilter\] = useState/a\
  const [selectedNeighbor, setSelectedNeighbor] = useState<any>(null);' src/components/Feed.tsx

sed -i 's/<h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1">/<h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setSelectedNeighbor(post)}>/' src/components/Feed.tsx

sed -i '/{activeMoment && (/i\
      {/* Neighbor Profile Modal */}\
      {selectedNeighbor && (\
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">\
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">\
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">\
              <button onClick={() => setSelectedNeighbor(null)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40">\
                <X className="w-5 h-5" />\
              </button>\
            </div>\
            <div className="px-6 pb-6">\
              <div className="flex justify-between items-end -mt-12 mb-4">\
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">\
                  {selectedNeighbor.avatar ? (\
                    <img src={selectedNeighbor.avatar} alt="Avatar" className="w-full h-full object-cover" />\
                  ) : (\
                    <span className="text-4xl font-bold text-slate-400">{selectedNeighbor.author.charAt(0)}</span>\
                  )}\
                </div>\
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6">Message</Button>\
              </div>\
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">\
                {selectedNeighbor.author}\
                {selectedNeighbor.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}\
              </h2>\
              <p className="text-slate-500 dark:text-slate-400 mt-1">Resident in {selectedNeighbor.locationScope === '\''neighborhood'\'' ? '\''your neighborhood'\'' : '\''your building'\''}</p>\
              \
              <div className="mt-6 grid grid-cols-2 gap-4">\
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">\
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</div>\
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Active Neighbor</div>\
                </div>\
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">\
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Joined</div>\
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">March 2026</div>\
                </div>\
              </div>\
              \
              <div className="mt-6">\
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Recent Activity</h3>\
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic">\
                  Shared {selectedNeighbor.type.replace('\''_'\', '\'' '\')} recently.\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      )}\
' src/components/Feed.tsx

const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const modalHtml = `
      {/* Neighbor Profile Modal */}
      {selectedNeighbor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 no-scrollbar">
            <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
              <button onClick={() => setSelectedNeighbor(null)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex justify-between items-end -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {selectedNeighbor.avatar ? (
                    <img src={selectedNeighbor.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-bold text-slate-400">{selectedNeighbor.author.charAt(0)}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6">Message</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedNeighbor.author}
                  {selectedNeighbor.verified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                </h2>
                <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>95 Trust Score</span>
                </div>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Resident in {selectedNeighbor.locationScope === 'neighborhood' ? 'your neighborhood' : 'your building'}
              </p>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Joined</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> March 2026
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Posts</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-slate-400" /> 14 Contributions
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Demographics & Family</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Nationality</span>
                    <span className="font-medium text-slate-900 dark:text-white">Azerbaijani</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Children</span>
                    <span className="font-medium text-slate-900 dark:text-white">2 (Ages 5, 8)</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Pets</span>
                    <span className="font-medium text-slate-900 dark:text-white">1 Dog (Golden Retriever)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-semibold uppercase">{selectedNeighbor.type.replace('_', ' ')}</span>
                      <span className="text-xs text-slate-400">{selectedNeighbor.time}</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{selectedNeighbor.content}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  /\{\/\* Neighbor Profile Modal \*\/\}[\s\S]*?\}\)/,
  modalHtml.trim()
);

fs.writeFileSync('src/components/Feed.tsx', content);

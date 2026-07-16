const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const searchHtml = `                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.comm_events', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.comm_events_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('events')}
                    className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none \${notifications.events ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}\`}
                  >
                    <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${notifications.events ? 'translate-x-6' : 'translate-x-1'}\`} />
                  </button>
                </div>`;

const extraHtml = `
                {/* New Neighbors */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Globe className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.new_neighbors', language) || 'New Neighbors'}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.new_neighbors_desc', language) || 'Alerts when people from your country or with similar interests join nearby'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('newNeighbors')}
                    className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none \${notifications.newNeighbors !== false ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}\`}
                  >
                    <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${notifications.newNeighbors !== false ? 'translate-x-6' : 'translate-x-1'}\`} />
                  </button>
                </div>`;

content = content.replace(searchHtml, searchHtml + extraHtml);

fs.writeFileSync('src/components/Profile.tsx', content);

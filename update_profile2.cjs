const fs = require('fs');

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const locationsSection = `
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex justify-between items-center">
                <span>My Locations</span>
                <span className="text-xs font-normal text-indigo-500 cursor-pointer">+ Add Location</span>
              </h3>
              <div className="space-y-3">
                {user.locations?.map(loc => (
                  <div key={loc.id} className="flex justify-between items-center p-3 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{loc.name}</span>
                        {loc.verified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold">VERIFIED</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-[10px] font-bold">UNVERIFIED</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{loc.address} ({loc.district})</div>
                    </div>
                  </div>
                ))}
                {(!user.locations || user.locations.length === 0) && (
                  <p className="text-sm text-slate-500 text-center py-4">No specific locations added yet. Add a home or workplace to unlock neighborhood features.</p>
                )}
              </div>
            </div>
`;

profile = profile.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<BirthdaySettings \/>/m, locationsSection + '\n          </div>\n          <BirthdaySettings />');

fs.writeFileSync('src/components/Profile.tsx', profile);

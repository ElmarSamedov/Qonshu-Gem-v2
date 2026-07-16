sed -i '/onChange={(e) => setBusinessCategory(e.target.value)}/a\
                      className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"\
                    />\
                  </div>\
                  <div className="space-y-2">\
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">VOIN</label>\
                    <Input\
                      type="text"\
                      placeholder="e.g. 1234567891"\
                      value={voin}\
                      onChange={(e) => setVoin(e.target.value)}\
                      className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"\
                    />' src/components/AuthScreen.tsx

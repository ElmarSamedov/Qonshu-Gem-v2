sed -i '/<BirthdaySettings \/>/i\
          <div className="p-6 border-b border-black/10 dark:border-white/10">\
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Family & Demographics</h3>\
            <div className="space-y-4">\
              <div className="space-y-1">\
                <label className="text-xs text-slate-600 dark:text-slate-400">Nationality</label>\
                <input \
                  type="text" \
                  placeholder="e.g. Azerbaijani" \
                  className="w-full bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white"\
                  value={user?.nationality || '\'''\''}\
                  onChange={(e) => updateUser({ nationality: e.target.value })}\
                />\
              </div>\
              <div className="grid grid-cols-2 gap-4">\
                <div className="space-y-1">\
                  <label className="text-xs text-slate-600 dark:text-slate-400">Number of Children</label>\
                  <input \
                    type="number" \
                    placeholder="0" \
                    className="w-full bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white"\
                    value={user?.childrenCount || 0}\
                    onChange={(e) => updateUser({ childrenCount: parseInt(e.target.value) || 0 })}\
                  />\
                </div>\
                <div className="space-y-1">\
                  <label className="text-xs text-slate-600 dark:text-slate-400">Ages (e.g. 5, 8)</label>\
                  <input \
                    type="text" \
                    placeholder="e.g. 5, 8" \
                    className="w-full bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white"\
                    value={user?.childrenAges || '\'''\''}\
                    onChange={(e) => updateUser({ childrenAges: e.target.value })}\
                  />\
                </div>\
              </div>\
            </div>\
          </div>' src/components/Profile.tsx

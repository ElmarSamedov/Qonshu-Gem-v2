sed -i '/<div className="p-4 sm:p-8">/i\
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 p-3 flex justify-between items-center text-sm sm:static sm:z-auto sm:bg-transparent sm:border-none sm:px-8 sm:pt-6 sm:pb-0">\
          <div className="flex items-center space-x-2">\
            <span className="font-semibold text-slate-800 dark:text-slate-200">Ghost Mode (Anonymity)</span>\
          </div>\
          <button \
            onClick={() => {\
              if (!user?.isAnonymous) {\
                if(confirm('\''Activate Full Anonymity for $5/month?'\'')) {\
                  updateUser({ isAnonymous: true });\
                }\
              } else {\
                updateUser({ isAnonymous: false });\
              }\
            }}\
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${user?.isAnonymous ? '\''bg-indigo-600 text-white'\'' : '\''bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'\''}`}\
          >\
            {user?.isAnonymous ? '\''Active'\'' : '\''Enable ($5/mo)'\''}\
          </button>\
        </div>' src/components/Layout.tsx

sed -i 's/const { user } = useAuthStore();/const { user, updateUser } = useAuthStore();/' src/components/Layout.tsx

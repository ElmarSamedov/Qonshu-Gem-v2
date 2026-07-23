const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

const target = `              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                {activeChat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activeChat.type === 'business' ? 'Verified Business' : t('common.neighbor', language)}</p>
              </div>
            </div>
            
            {/* Report Button */}
            <button
              onClick={() => setReportDialog(activeChat.id)}
              className="ml-auto text-slate-400 hover:text-red-500 p-2 transition-colors"
              title="Report User"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>`;

const replacement = `              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                {activeChat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activeChat.type === 'business' ? 'Verified Business' : t('common.neighbor', language)}</p>
              </div>
              
              {/* Report Button */}
              <button
                onClick={() => setReportDialog(activeChat.id)}
                className="text-slate-400 hover:text-red-500 p-2 transition-colors flex-shrink-0"
                title="Report User"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Chat.tsx', content);

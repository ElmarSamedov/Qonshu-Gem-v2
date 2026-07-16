const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if(!content.includes("showPaymentModal")) {
  content = content.replace(
    "import React from 'react';",
    "import React, { useState } from 'react';"
  );

  // Add state for payment modal
  content = content.replace(
    'const { user, updateUser } = useAuthStore();',
    `const { user, updateUser } = useAuthStore();\n  const [showPaymentModal, setShowPaymentModal] = useState(false);`
  );

  // Replace button with switch and modal
  const switchHtml = `
            <button 
              onClick={() => {
                if (!user?.isAnonymous) {
                  setShowPaymentModal(true);
                } else {
                  updateUser({ isAnonymous: false, name: user?.originalName || 'New Neighbor', avatar: user?.originalAvatar });
                }
              }}
              className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 \${user?.isAnonymous ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}\`}
            >
              <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${user?.isAnonymous ? 'translate-x-6' : 'translate-x-1'}\`} />
            </button>

            {showPaymentModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-black/10 dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Activate Ghost Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Enjoy complete anonymity across the platform for a $5/month subscription. Your name and avatar will be hidden.</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Total</span>
                        <span className="font-bold text-xl text-slate-900 dark:text-white">$5.00<span className="text-sm text-slate-500">/mo</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        updateUser({ isAnonymous: true, originalName: user?.name, originalAvatar: user?.avatar, name: 'Anonymous', avatar: undefined });
                        setShowPaymentModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      Pay & Activate
                    </button>
                  </div>
                </div>
              </div>
            )}
  `;

  content = content.replace(
    /<button[\s\S]*?className=\{`px-3 py-1 text-xs rounded-full font-medium transition-colors \$\{user\?\.isAnonymous \? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'\}`\}[\s\S]*?>[\s\S]*?\{user\?\.isAnonymous \? 'Active' : 'Enable \(\$5\/mo\)'\}[\s\S]*?<\/button>/,
    switchHtml
  );

  // For the matte green screen we can just add a conditional class to the main container.
  content = content.replace(
    "className={`mx-auto flex h-screen max-w-md flex-col bg-transparent text-slate-100 sm:max-w-4xl sm:flex-row overflow-hidden sm:rounded-[2rem] sm:my-8 sm:h-[calc(100vh-4rem)] border border-black/10 dark:border-white/10 relative shadow-2xl ${seniorMode ? 'senior-mode' : ''}`}",
    "className={`mx-auto flex h-screen max-w-md flex-col text-slate-100 sm:max-w-4xl sm:flex-row overflow-hidden sm:rounded-[2rem] sm:my-8 sm:h-[calc(100vh-4rem)] border border-black/10 dark:border-white/10 relative shadow-2xl ${seniorMode ? 'senior-mode' : ''} ${user?.isAnonymous ? 'bg-[#4d6c5b]' : 'bg-transparent'}`}"
  );
}

fs.writeFileSync('src/components/Layout.tsx', content);

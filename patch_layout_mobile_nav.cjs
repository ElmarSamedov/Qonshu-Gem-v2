const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const importRegex = /import React from 'react';/;
const importReplacement = `import React, { useState } from 'react';`;
content = content.replace(importRegex, importReplacement);

const iconImportRegex = /import \{ (.*) \} from 'lucide-react';/;
content = content.replace(iconImportRegex, (match, p1) => {
  if (!p1.includes('Menu')) {
    return `import { ${p1}, Menu, X } from 'lucide-react';`;
  }
  return match;
});

const componentRegex = /export default function Layout\(\) \{/;
const componentReplacement = `export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`;
content = content.replace(componentRegex, componentReplacement);

const mobileNavRegex = /\{\/\* Mobile Bottom Nav \*\/\}\s*<nav className="glass-panel fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-black\/10 dark:border-white\/10 sm:hidden overflow-x-auto no-scrollbar">\s*\{navItems\.map\(\(item\) => \([\s\S]*?\)\)\}\s*<\/nav>/;
const mobileNavReplacement = `{/* Mobile Bottom Nav */}
      <nav className="glass-panel fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-black/10 dark:border-white/10 sm:hidden">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              \`flex flex-col items-center justify-center space-y-1 w-full h-full min-w-[4rem] transition-colors \${
                isActive ? 'text-blue-400' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300'
              }\`
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 w-full h-full min-w-[4rem] transition-colors text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium truncate w-full text-center">More</span>
        </button>
      </nav>

      {/* Mobile Slide-up Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-y-auto max-h-[80vh] pb-8 pt-4 px-4 border-t border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {navItems.slice(4).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    \`flex flex-col items-center justify-center space-y-2 p-3 rounded-xl transition-colors \${
                      isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }\`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="space-y-4 px-2 border-t border-black/10 dark:border-white/10 pt-6">
              <LocationSwitcher />
              {isGuest && (
                <NavLink to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors">
                  Sign In / Register
                </NavLink>
              )}
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}`;

content = content.replace(mobileNavRegex, mobileNavReplacement);
fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx mobile nav");

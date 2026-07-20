const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!layout.includes('LocationSwitcher')) {
  layout = layout.replace(/import LanguageSelector from '\.\/LanguageSelector';/m, "import LanguageSelector from './LanguageSelector';\nimport LocationSwitcher from './LocationSwitcher';");
}

const sidebarReplacement = `
        <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
          <LocationSwitcher />
          {isGuest && (
            <NavLink to="/auth" className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors">
              Sign In / Register
            </NavLink>
          )}
          <LanguageSelector />
        </div>
`;
layout = layout.replace(/<div className="pt-4 border-t border-black\/10 dark:border-white\/10 space-y-4">[\s\S]*?<LanguageSelector \/>\s*<\/div>/m, sidebarReplacement);

fs.writeFileSync('src/components/Layout.tsx', layout);

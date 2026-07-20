const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const navLogic = `
  const isGuest = user?.role === 'guest';
  const baseNavItems = [
    { to: '/', icon: Home, label: t('nav.feed', language) },
    { to: '/mutual-aid', icon: HeartHandshake, label: t('nav.help', language) },
    { to: '/marketplace', icon: ShoppingBag, label: t('nav.market', language) },
    { to: '/businesses', icon: Store, label: t('nav.businesses', language) },
    { to: '/events', icon: Calendar, label: t('nav.events', language) },
    { to: '/polls', icon: BarChart2, label: t('nav.polls', language) },
    { to: '/recommendations', icon: Briefcase, label: t('nav.recommendations', language) },
  ];

  const authNavItems = isGuest ? [] : [
    { to: '/chat', icon: MessageCircle, label: t('nav.chat', language) },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/profile', icon: User, label: t('nav.profile', language) },
  ];

  const navItems = [...baseNavItems, ...authNavItems];
`;

layout = layout.replace(/const navItems = \[\s*\{ to: '\/', icon: Home[\s\S]*?\{ to: '\/profile', icon: User, label: t\('nav.profile', language\) \},\s*\];/m, navLogic);

// Add a Login button for guests in the sidebar
const sidebarBottom = `
        <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
          {isGuest && (
            <NavLink to="/auth" className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors">
              Sign In / Register
            </NavLink>
          )}
          <LanguageSelector />
        </div>
`;
layout = layout.replace(/<div className="pt-4 border-t border-black\/10 dark:border-white\/10">\s*<LanguageSelector \/>\s*<\/div>/m, sidebarBottom);

// And mobile header sign in
const mobileHeader = `
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-black/10 dark:border-white/10 glass-panel px-4 sm:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 text-lg font-bold text-white">Q</div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Qonşu</h1>
          </div>
          <div className="flex items-center gap-3">
            {isGuest && (
              <NavLink to="/auth" className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg">Sign In</NavLink>
            )}
            <LanguageSelector />
          </div>
        </header>
`;

layout = layout.replace(/<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-black\/10 dark:border-white\/10 glass-panel px-4 sm:hidden">[\s\S]*?<LanguageSelector \/>\s*<\/header>/m, mobileHeader);

fs.writeFileSync('src/components/Layout.tsx', layout);

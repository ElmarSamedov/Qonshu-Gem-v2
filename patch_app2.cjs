const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const \{ isAuthenticated, isAuthLoaded \} = useAuthStore\(\);\n  const isGuest = user\?.role === 'guest' \|\| !isAuthenticated;/;
const replacement = `const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const hasAccess = isAuthenticated || isGuest;`;
content = content.replace(regex, replacement);

const routesRegex = /<Route path="\/" element=\{<Layout \/>\}>([\s\S]*?)<\/Route>/;
const routesReplacement = `<Route path="/" element={hasAccess ? <Layout /> : <Navigate to="/welcome" replace />}>
          <Route index element={isGuest ? <Navigate to="/welcome" replace /> : <Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="mutual-aid" element={<MutualAid />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="businesses" element={<LocalBusinesses />} />
          <Route path="portrait" element={<DistrictPortrait />} />
          <Route path="events" element={<CalendarView />} />
          <Route path="polls" element={<Polls />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="chat" element={!isGuest ? <Chat /> : <Navigate to="/auth" replace />} />
          <Route path="groups" element={!isGuest ? <Groups /> : <Navigate to="/auth" replace />} />  
          <Route path="profile" element={!isGuest ? <Profile /> : <Navigate to="/auth" replace />} />
          <Route path="moderator" element={!isGuest ? <ModeratorPanel /> : <Navigate to="/" replace />} />
        </Route>`;
content = content.replace(routesRegex, routesReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx Routes");

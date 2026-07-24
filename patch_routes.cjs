const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const routesRegex = /<Route path="\/welcome" element=\{isGuest \? <GuestWelcome \/> : <Navigate to="\/" replace \/>\} \/>\n\s*<Route path="\/onboarding" element=\{isGuest \? <OnboardingWizard \/> : <Navigate to="\/" replace \/>\} \/>\n\s*<Route path="\/auth" element=\{isGuest \? <AuthScreen \/> : <Navigate to="\/" replace \/>\} \/>/;

const routesReplacement = `<Route path="/welcome" element={!isAuthenticated ? <GuestWelcome /> : <Navigate to="/" replace />} />
        <Route path="/onboarding" element={!isAuthenticated ? <OnboardingWizard /> : <Navigate to="/" replace />} />
        <Route path="/auth" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/" replace />} />`;

content = content.replace(routesRegex, routesReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched Routes");

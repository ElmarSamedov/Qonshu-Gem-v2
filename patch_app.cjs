const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import OnboardingWizard')) {
  content = content.replace(
    "import GuestWelcome from './components/GuestWelcome';",
    "import GuestWelcome from './components/GuestWelcome';\nimport OnboardingWizard from './components/onboarding/OnboardingWizard';"
  );
}

if (!content.includes('<Route path="/onboarding"')) {
  content = content.replace(
    '<Route path="/welcome" element={isGuest ? <GuestWelcome /> : <Navigate to="/" replace />} />',
    '<Route path="/welcome" element={isGuest ? <GuestWelcome /> : <Navigate to="/" replace />} />\n        <Route path="/onboarding" element={isGuest ? <OnboardingWizard /> : <Navigate to="/" replace />} />'
  );
}

fs.writeFileSync('src/App.tsx', content);

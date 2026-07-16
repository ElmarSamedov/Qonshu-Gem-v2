const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// Add InterestsSelector import
if (!content.includes('import InterestsSelector')) {
  content = content.replace(
    "import BirthdaySettings from \"./BirthdaySettings\";",
    "import BirthdaySettings from \"./BirthdaySettings\";\nimport InterestsSelector from \"./InterestsSelector\";"
  );
}

// Add the Interests section right before Notification Preferences
const interestsSection = `
          {/* Interests Section */}
          <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">Interests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <InterestsSelector />
            </CardContent>
          </Card>
`;

content = content.replace(
  "{/* Router Code */}",
  interestsSection + "\n          {/* Router Code */}"
);

fs.writeFileSync('src/components/Profile.tsx', content);

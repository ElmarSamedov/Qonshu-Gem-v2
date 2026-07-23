const fs = require('fs');
let content = fs.readFileSync('src/components/profile/SafetyCheckInSettings.tsx', 'utf8');

const target = `</CardContent>`;
const replacement = `
        <div className="space-y-3 border-t border-black/5 dark:border-white/5 pt-4">
          <Label className="text-slate-700 dark:text-slate-300">Requests to become a Contact</Label>
          <div className="space-y-2">
            {/* Mocked incoming request list */}
            <p className="text-sm text-slate-500 italic">No incoming requests.</p>
          </div>
        </div>
      </CardContent>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/profile/SafetyCheckInSettings.tsx', content);
console.log("Patched SafetyCheckInSettings.tsx with incoming requests");

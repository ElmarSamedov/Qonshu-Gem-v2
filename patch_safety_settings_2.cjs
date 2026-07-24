const fs = require('fs');
let content = fs.readFileSync('src/components/profile/SafetyCheckInSettings.tsx', 'utf8');

const regex = /body: JSON\.stringify\(\{ contactUid: contactId \}\)/;
const replacement = `body: JSON.stringify({ 
        contactUid: contactId,
        requesterUid: user?.uid,
        requesterName: user?.name
      })`;

content = content.replace(regex, replacement);

// We need to add "Approve Request" UI for incoming requests in SafetyCheckInSettings
const incomingRequestsRegex = /<div className="space-y-3 border-t border-black\/5 dark:border-white\/5 pt-4">[\s\S]*?<\/div>\s*<\/CardContent>/;
const incomingRequestsReplacement = `
        <div className="space-y-3 border-t border-black/5 dark:border-white/5 pt-4">
          <label className="text-slate-700 dark:text-slate-300">Requests to become a Contact</label>
          <div className="space-y-2">
            {/* The incoming requests will be handled by the Notifications dropdown */}
            <p className="text-sm text-slate-500 italic">Check your notifications bell for incoming requests.</p>
          </div>
        </div>
      </CardContent>`;

content = content.replace(incomingRequestsRegex, incomingRequestsReplacement);

fs.writeFileSync('src/components/profile/SafetyCheckInSettings.tsx', content);
console.log("Patched SafetyCheckInSettings.tsx");

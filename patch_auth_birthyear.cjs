const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const stateRegex = /const \[lastName, setLastName\] = useState\(''\);/;
const stateReplacement = `const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');`;
content = content.replace(stateRegex, stateReplacement);

const validationRegex = /if \(\!firstName \|\| \!lastName \|\| \!country \|\| \!city \|\| \!street \|\| \!building \|\| \!apartment\) \{/;
const validationReplacement = `if (!firstName || !lastName || !country || !city || !street || !building || !apartment || !birthYear) {`;
content = content.replace(validationRegex, validationReplacement);

const loginRegex = /const fullName = \`\$\{firstName\} \$\{lastName\}\`;/;
const loginReplacement = `const fullName = \`\$\{firstName\} \$\{lastName\}\`;
    // Auto-enable senior mode for age >= 60
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear || '0', 10);
    if (age >= 60) {
      if (!useSettingsStore.getState().seniorMode) {
        useSettingsStore.getState().toggleSeniorMode();
      }
    }`;
content = content.replace(loginRegex, loginReplacement);

const jsxRegex = /<div className="space-y-2">\s*<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number<\/label>/;
const jsxReplacement = `<div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">* Birth Year</label>
                    <Input
                      type="number"
                      placeholder="1980"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)} required
                      className="bg-white dark:bg-slate-800 text-black dark:text-black placeholder:text-gray-400 dark:placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log("Patched AuthScreen for birthYear");

const fs = require('fs');

let gate = fs.readFileSync('src/components/VerificationGate.tsx', 'utf8');

gate = gate.replace(
  /export default function VerificationGate\(\{ children \}: \{ children: React.ReactNode \}\) \{/m,
  "export default function VerificationGate({ children, compact = false }: { children: React.ReactNode, compact?: boolean }) {"
);

const renderBlock = `
  const isGuest = user?.role === 'guest';

  if (compact) {
    return (
      <div className="relative group rounded-xl overflow-hidden mt-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {isGuest ? (
            <button onClick={() => navigate('/auth')} className="text-indigo-600 hover:underline font-bold">Sign in</button>
          ) : (
            <button onClick={() => setIsVerifying(true)} className="text-indigo-600 hover:underline font-bold">Verify location</button>
          )}
          <span> to interact</span>
        </div>
      </div>
    );
  }

  return (
`;

gate = gate.replace(/const isGuest = user\?\.role === 'guest';\n\n  return \(/m, renderBlock);

fs.writeFileSync('src/components/VerificationGate.tsx', gate);

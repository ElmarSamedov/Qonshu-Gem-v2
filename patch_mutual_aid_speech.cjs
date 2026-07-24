const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

const importRegex = /import \{ useLanguageStore \} from '\.\.\/store\/useLanguageStore';/;
const importReplacement = `import { useLanguageStore } from '../store/useLanguageStore';
import { useSpeechRecognition } from '../lib/useSpeechRecognition';
import { Mic } from 'lucide-react';`;
content = content.replace(importRegex, importReplacement);

const stateRegex = /const \[showNewRequest, setShowNewRequest\] = useState\(false\);/;
const stateReplacement = `const [showNewRequest, setShowNewRequest] = useState(false);
  const { isListening, transcript, startListening, stopListening, support, setTranscript } = useSpeechRecognition();
  
  React.useEffect(() => {
    if (transcript) {
      setNewRequest((prev) => {
        const base = prev.description.replace(localStorage.getItem('aidTranscript') || '', '').trim();
        localStorage.setItem('aidTranscript', transcript);
        return { ...prev, description: base ? base + ' ' + transcript : transcript };
      });
    }
  }, [transcript]);`;
content = content.replace(stateRegex, stateReplacement);

const jsxRegex = /<textarea[\s\S]*?required\s*\/>/;
const jsxReplacement = `
                  <div className="relative">
                    <textarea 
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      placeholder="Provide details about what you need..."
                      className="w-full h-24 rounded-md bg-white/40 dark:bg-black/20 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                      required
                    />
                    {support && (
                      <button
                        type="button"
                        onClick={isListening ? stopListening : startListening}
                        className={\`absolute right-2 top-2 p-2 rounded-full transition-colors \${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}\`}
                        title="Voice Typing"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                  </div>
`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Patched MutualAid for speech");

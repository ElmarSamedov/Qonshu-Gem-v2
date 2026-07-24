const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const importRegex = /import \{ Send, MapPin, /;
const importReplacement = `import { Send, MapPin, Mic, `;
content = content.replace(importRegex, importReplacement);

const importSpeech = /import \{ useLanguageStore \} from '\.\.\/store\/useLanguageStore';/;
const importSpeechReplacement = `import { useLanguageStore } from '../store/useLanguageStore';\nimport { useSpeechRecognition } from '../lib/useSpeechRecognition';`;
content = content.replace(importSpeech, importSpeechReplacement);

const stateRegex = /const \[postDraftContent, setPostDraftContent\] = useState\(\(\) => localStorage\.getItem\('feedPostDraft'\) \|\| ''\);/;
const stateReplacement = `const [postDraftContent, setPostDraftContent] = useState(() => localStorage.getItem('feedPostDraft') || '');
  const { isListening, transcript, startListening, stopListening, support, setTranscript } = useSpeechRecognition();
  
  React.useEffect(() => {
    if (transcript) {
      setPostDraftContent((prev) => {
        const base = prev.replace(localStorage.getItem('lastTranscript') || '', '').trim();
        localStorage.setItem('lastTranscript', transcript);
        return base ? base + ' ' + transcript : transcript;
      });
    }
  }, [transcript]);`;
content = content.replace(stateRegex, stateReplacement);

const jsxRegex = /<Textarea[\s\S]*?\/>/;
const jsxReplacement = `
              <div className="relative">
                <Textarea 
                  placeholder={t('feed.post_placeholder', language)} 
                  value={postDraftContent}
                  onChange={(e) => setPostDraftContent(e.target.value)}
                  className="mb-4 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 resize-none pr-10" 
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

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed for speech");

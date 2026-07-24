const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

const stateRegex = /const \[showForm, setShowForm\] = useState\(false\);/;
const stateReplacement = `const [showForm, setShowForm] = useState(false);
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

fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Fixed MutualAid");

const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

// replace everything from `const [requests` to `setShowForm(false);\n  };`
const startIdx = content.indexOf('  const [requests, setRequests] = useState<HelpRequest[]>');
const endIdx = content.indexOf('setShowForm(false);\n  };') + 'setShowForm(false);\n  };'.length;

if (startIdx !== -1 && endIdx !== -1) {
  const newState = `  const [requests, setRequests] = useState<any[]>([]);
  const [resolveDialogReq, setResolveDialogReq] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'requests' | 'registry'>('requests');

  React.useEffect(() => {
    const q = query(collection(db, 'mutual_aid_requests'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRequests(list);
    });
    return unsub;
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.description || !user) return;
    
    try {
      await addDoc(collection(db, 'mutual_aid_requests'), {
        title: newRequest.title,
        description: newRequest.description,
        type: newRequest.type,
        author: user.name,
        authorId: user.uid,
        verified: user.verified || false,
        district: user.district || 'Unknown',
        status: 'open',
        timestamp: serverTimestamp(),
        responders: []
      });
      setNewRequest({ title: '', description: '', type: 'service' });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };`;
  content = content.substring(0, startIdx) + newState + content.substring(endIdx);
} else {
  console.log("Could not find state string", startIdx, endIdx);
}

const handleOfferHelpTarget = `  const handleOfferHelp = (req: HelpRequest) => {
    openOrCreateChat(\`neighbor-\${req.author}\`, req.author, 'neighbor');
    navigate('/chat');
  };`;

const handleOfferHelpReplacement = `  const handleOfferHelp = async (req: any) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'mutual_aid_requests', req.id), {
        responders: arrayUnion({ uid: user.uid, name: user.name })
      });
    } catch(e) {}
    openOrCreateChat(\`neighbor-\${req.authorId}\`, req.author, 'neighbor');
    navigate('/chat');
  };`;

content = content.replace(handleOfferHelpTarget, handleOfferHelpReplacement);

fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Patched state");

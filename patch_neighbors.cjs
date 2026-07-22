const fs = require('fs');
let content = fs.readFileSync('src/components/profile/MyNeighbors.tsx', 'utf8');

content = content.replace(
  "import { useAuthStore } from '../../store/useAuthStore';",
  "import { useAuthStore } from '../../store/useAuthStore';\nimport { db } from '../../lib/firebase';\nimport { collection, query, where, getDocs } from 'firebase/firestore';"
);

content = content.replace(
  "const [searchResult, setSearchResult] = useState<any>(null);",
  "const [searchResult, setSearchResult] = useState<any>(null);\n  const [isSearching, setIsSearching] = useState(false);"
);

const oldSearch = `const handleSearch = () => {
    if (searchPhone === '+994501112233') {
      setSearchResult({ id: 3, name: 'Tural S.', phone: '+994501112233', distance: '15m (Downstairs)' });
    } else {
      alert(t('profile.neighbor_not_found', language));
      setSearchResult(null);
    }
  };`;

const newSearch = `const handleSearch = async () => {
    if (!searchPhone.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const q = query(collection(db, 'users'), where('phone', '==', searchPhone.trim()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        setSearchResult({ id: docSnap.id, name: data.name || 'Neighbor', phone: data.phone, distance: data.apartment || 'Neighbor' });
      } else {
        alert(t('profile.neighbor_not_found', language) || 'Neighbor not found.');
      }
    } catch (e) {
      console.error("Failed to search neighbors:", e);
    }
    setIsSearching(false);
  };`;

content = content.replace(oldSearch, newSearch);

content = content.replace(
  `<Button onClick={handleSearch} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {t('profile.search', language) || 'Search'}
          </Button>`,
  `<Button onClick={handleSearch} disabled={isSearching || !searchPhone.trim()} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {isSearching ? 'Searching...' : (t('profile.search', language) || 'Search')}
          </Button>`
);

fs.writeFileSync('src/components/profile/MyNeighbors.tsx', content);

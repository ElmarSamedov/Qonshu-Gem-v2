const fs = require('fs');
let content = fs.readFileSync('src/components/InterestsSelector.tsx', 'utf8');

const targetImport = "import { useLanguageStore } from '../store/useLanguageStore';";
const replacementImport = "import { useLanguageStore } from '../store/useLanguageStore';\nimport { useInterestsStore, InterestNode } from '../store/useInterestsStore';";

content = content.replace(targetImport, replacementImport);

const targetInterface = `interface InterestNode {
  id: string;
  parent_id: string | null;
  interest_en: string;
  interest_ru: string;
  interest_az: string;
  level: string;
}`;
content = content.replace(targetInterface, "");

const targetState = `  const [interests, setInterests] = useState<InterestNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/interests.json')
      .then(res => res.json())
      .then(data => {
        setInterests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load interests', err);
        setLoading(false);
      });
  }, []);`;

const replacementState = `  const { interests, loading, fetchInterests } = useInterestsStore();

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);`;

content = content.replace(targetState, replacementState);

fs.writeFileSync('src/components/InterestsSelector.tsx', content);
console.log("Updated InterestsSelector.tsx");

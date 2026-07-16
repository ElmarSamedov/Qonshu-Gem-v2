const fs = require('fs');
let content = fs.readFileSync('src/components/InterestsSelector.tsx', 'utf8');

content = content.replace(
  'const [selectedLevel4, setSelectedLevel4] = useState(\'\');',
  `const [selectedLevel4, setSelectedLevel4] = useState('');
  const [addedInterests, setAddedInterests] = useState<InterestNode[]>([]);

  const handleAddInterest = () => {
    const interestId = selectedLevel4 || selectedLevel3 || selectedLevel2 || selectedLevel1;
    if (interestId) {
      const interest = interests.find(i => i.id === interestId);
      if (interest && !addedInterests.find(i => i.id === interestId)) {
        setAddedInterests([...addedInterests, interest]);
        // Reset selections
        setSelectedLevel1('');
        setSelectedLevel2('');
        setSelectedLevel3('');
        setSelectedLevel4('');
      }
    }
  };`
);

const addBtn = `
      {selectedLevel1 && (
        <div className="pt-2 flex justify-end">
          <button 
            onClick={handleAddInterest}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Interest
          </button>
        </div>
      )}

      {addedInterests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Your Interests</h4>
          <div className="flex flex-wrap gap-2">
            {addedInterests.map(interest => (
              <div key={interest.id} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium flex items-center gap-2 border border-indigo-100 dark:border-indigo-800">
                {interest.name}
                <button 
                  onClick={() => setAddedInterests(addedInterests.filter(i => i.id !== interest.id))}
                  className="hover:text-indigo-900 dark:hover:text-indigo-100 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

content = content.replace('    </div>\n  );\n}', addBtn + '    </div>\n  );\n}');

fs.writeFileSync('src/components/InterestsSelector.tsx', content);

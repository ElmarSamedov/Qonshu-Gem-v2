const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
`              {activeMomentIndex !== null && (
        <MomentViewer 
          moments={moments} 
          initialIndex={activeMomentIndex} 
          onClose={() => setActiveMomentIndex(null)} 
        />
      )}
    </div>
      )}`,
`          </div>
        </div>
      )}
      
      {activeMomentIndex !== null && (
        <MomentViewer 
          moments={moments} 
          initialIndex={activeMomentIndex} 
          onClose={() => setActiveMomentIndex(null)} 
        />
      )}
    </div>`
);

fs.writeFileSync('src/components/Feed.tsx', content);

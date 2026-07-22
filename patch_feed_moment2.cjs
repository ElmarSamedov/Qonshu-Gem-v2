const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const replacement = `      {activeMomentIndex !== null && (
        <MomentViewer 
          moments={moments} 
          initialIndex={activeMomentIndex} 
          onClose={() => setActiveMomentIndex(null)} 
        />
      )}`;

const idx = content.lastIndexOf('</div>');
content = content.substring(0, idx) + replacement + '\n    ' + content.substring(idx);

fs.writeFileSync('src/components/Feed.tsx', content);

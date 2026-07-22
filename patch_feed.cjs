const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
  "import { useModerationStore } from '../store/useModerationStore';",
  "import { useModerationStore } from '../store/useModerationStore';\nimport NeighborhoodPulse from './NeighborhoodPulse';"
);

content = content.replace(
  `      </div>\n\n      {/* Moments */}`,
  `      </div>\n\n      {!isGuest && <NeighborhoodPulse />}\n\n      {/* Moments */}`
);

fs.writeFileSync('src/components/Feed.tsx', content);

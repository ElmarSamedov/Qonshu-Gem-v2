const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

// Replace state
content = content.replace(
  'const [activeMoment, setActiveMoment] = useState<any>(null);',
  'const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null);'
);

// Add import
content = content.replace(
  "import { MapPin, Bell, Search, Star, MessageSquare, ThumbsUp, Camera, Plus, X, Flag, BadgeCheck, CheckCircle2, ChevronRight, Share2, Play, Users, Briefcase, Video, Mic, Map } from 'lucide-react';",
  "import { MapPin, Bell, Search, Star, MessageSquare, ThumbsUp, Camera, Plus, X, Flag, BadgeCheck, CheckCircle2, ChevronRight, Share2, Play, Users, Briefcase, Video, Mic, Map } from 'lucide-react';\nimport MomentViewer from './MomentViewer';"
);

// Update button onClick
content = content.replace(
  /onClick=\{\(\) => setActiveMoment\(moment\)\}/g,
  'onClick={() => setActiveMomentIndex(moments.findIndex(m => m.id === moment.id))}'
);

// We need to replace the old {activeMoment && ( ... )} block with the new component.
// Instead of a regex, I will just do a string replacement of a few distinct parts or use a script to slice it out.

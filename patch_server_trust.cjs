const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target = `const updates: any = { reliabilityScore };`;
const replacement = `let trust_scores = userData.trust_scores || { identity: 40, location: 0, community: 10, overall: 50 };
          trust_scores.community = Math.min(100, (trust_scores.community || 0) + scoreToAdd * 2);
          trust_scores.overall = Math.min(100, Math.round((trust_scores.identity * 0.4) + (trust_scores.location * 0.4) + (trust_scores.community * 0.2)));
          const updates: any = { reliabilityScore, trust_scores };`;

content = content.replace(target, replacement);

const targetMutualAid = `const updates: any = { points, reliabilityScore };`;
const replacementMutualAid = `let trust_scores = helperData?.trust_scores || { identity: 40, location: 0, community: 10, overall: 50 };
          trust_scores.community = Math.min(100, (trust_scores.community || 0) + 10 * 2);
          trust_scores.overall = Math.min(100, Math.round((trust_scores.identity * 0.4) + (trust_scores.location * 0.4) + (trust_scores.community * 0.2)));
          const updates: any = { points, reliabilityScore, trust_scores };`;

content = content.replace(targetMutualAid, replacementMutualAid);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with trust_scores updates");

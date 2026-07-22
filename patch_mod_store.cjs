const fs = require('fs');
let content = fs.readFileSync('src/store/useModerationStore.ts', 'utf8');

const oldAddReport = /addReport: async \(report\) => \{\s*const id = Math\.random\(\)\.toString\(36\)\.substring\(7\);\s*\/\/ Simulate AI Moderation scoring[\s\S]*?const newReport: Report = \{[\s\S]*?id,[\s\S]*?timestamp: new Date\(\)\.toISOString\(\),[\s\S]*?status: 'pending',[\s\S]*?aiScores: \{[\s\S]*?nsfw: Math\.min\(1, nsfwScore\),[\s\S]*?arLaw: Math\.min\(1, arLawScore\)[\s\S]*?\}[\s\S]*?\};\s*try \{/g;

const newAddReport = `addReport: async (report) => {
    const id = Math.random().toString(36).substring(7);
    
    const newReport: Report = {
      ...report,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {`;

content = content.replace(oldAddReport, newAddReport);
fs.writeFileSync('src/store/useModerationStore.ts', content);

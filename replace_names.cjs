const fs = require('fs');

function replaceInFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replacements
  content = content.replace(/Leyla M\./g, "Jane D.");
  content = content.replace(/Leyla/g, "Jane");
  content = content.replace(/Elmar/g, "John");
  content = content.replace(/Aysel H\./g, "Sarah T.");
  content = content.replace(/Aysel/g, "Sarah");
  content = content.replace(/Kamran B\./g, "Mike R.");
  content = content.replace(/Kamran/g, "Mike");
  content = content.replace(/Samir/g, "David");
  content = content.replace(/Tural S\./g, "Chris W.");
  content = content.replace(/Tural/g, "Chris");

  fs.writeFileSync(filepath, content);
}

const files = [
  'src/components/Feed.tsx',
  'src/components/CalendarView.tsx',
  'src/components/Groups.tsx',
  'src/components/Polls.tsx',
  'src/components/LocalBusinesses.tsx'
];

files.forEach(replaceInFile);
console.log("Replaced names");

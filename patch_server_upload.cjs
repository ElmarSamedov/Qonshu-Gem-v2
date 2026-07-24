const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const importRegex = /import express from "express";/;
const importReplacement = `import express from "express";
import multer from "multer";
import fs from "fs";`;

content = content.replace(importRegex, importReplacement);

const uploadLogic = `
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Multer config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.png';
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
  });
  const upload = multer({ storage });

  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the public URL
    const url = \`/uploads/\${req.file.filename}\`;
    res.json({ url });
  });

  // Serve uploads statically
  app.use('/uploads', express.static(uploadsDir));
`;

const setupRegex = /async function startServer\(\) \{[\s\S]*?const PORT = 3000;/;
const setupReplacement = `async function startServer() {
  const app = express();
  const PORT = 3000;
  
  ${uploadLogic}
`;

content = content.replace(setupRegex, setupReplacement);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with upload route");

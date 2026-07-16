import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example document upload for lazy verification
  app.post("/api/verify/document", upload.single("document"), async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid || !req.file) {
        return res.status(400).json({ error: "Missing uid or document file" });
      }

      // In a real app, upload to Cloud Storage. 
      // For MVP, we just record that a document was received and mark verification as pending.
      // Simulate file URL
      const mockFileUrl = `https://mockstorage.local/doc_${uid}_${Date.now()}.jpg`;

      // Simulating a successful upload response instead of using firebase-admin which fails without credentials
      res.json({ success: true, document_url: mockFileUrl });
    } catch (error: any) {
      console.error("Document upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

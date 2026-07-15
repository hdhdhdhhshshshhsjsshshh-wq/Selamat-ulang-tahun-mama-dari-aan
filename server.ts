import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Readable } from "stream";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy endpoint to download/stream from Google Drive bypasses iframe/cookie blocks
  app.get("/api/audio/:id", async (req, res) => {
    try {
      const fileId = req.params.id;
      const driveUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;

      console.log(`[Audio Proxy] Fetching audio from Google Drive for ID: ${fileId}`);
      
      const driveRes = await fetch(driveUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!driveRes.ok) {
        console.error(`[Audio Proxy] Google Drive responded with status: ${driveRes.status}`);
        res.status(driveRes.status).send(`Failed to fetch from Google Drive: ${driveRes.statusText}`);
        return;
      }

      // Read headers and stream back to browser
      const contentType = driveRes.headers.get("content-type") || "audio/mpeg";
      const contentLength = driveRes.headers.get("content-length");

      console.log(`[Audio Proxy] Stream headers - Content-Type: ${contentType}, Content-Length: ${contentLength}`);

      res.setHeader("Content-Type", contentType);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Accept-Ranges", "bytes");

      if (driveRes.body) {
        Readable.fromWeb(driveRes.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      console.error("[Audio Proxy] Error proxying Google Drive audio:", error);
      res.status(500).send("Error proxying audio");
    }
  });

  // API health route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite dev server or static distribution build serving
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

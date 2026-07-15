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
      let driveUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;

      console.log(`[Audio Proxy] Fetching audio from Google Drive for ID: ${fileId}`);
      
      // Store cookies returned by Google for session tracking (e.g., for large file confirmation)
      let cookies: string[] = [];
      const initialResponse = await fetch(driveUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      const setCookieHeaders = initialResponse.headers.getSetCookie();
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        cookies = setCookieHeaders.map(c => c.split(";")[0]);
      }

      let finalResponse = initialResponse;
      const contentType = initialResponse.headers.get("content-type") || "";

      // If Google Drive returns HTML, it's either a restriction login screen or a large file warning
      if (contentType.includes("text/html")) {
        const text = await initialResponse.text();

        // 1. Check if it's restricted/private (redirects to Google Accounts)
        if (initialResponse.url.includes("accounts.google.com") || text.includes("ServiceLogin") || text.includes("InteractiveLogin")) {
          console.error(`[Audio Proxy] ERROR: Google Drive file ${fileId} is PRIVATE / RESTRICTED.`);
          res.status(403).send(`
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #fee2e2; background-color: #fef2f2; color: #991b1b; border-radius: 12px; line-height: 1.6;">
              <h1 style="margin-top: 0; font-size: 22px;">🔒 File Google Drive Bersifat Privat (Dibatasi)</h1>
              <p>Lagu tidak bisa diputar karena pengaturan file Google Drive Anda masih bersifat <b>Privat / Dibatasi</b>.</p>
              <p><b>Cara Mengubah ke Publik agar Bisa Didengar Semua Orang:</b></p>
              <ol style="margin-bottom: 20px; padding-left: 20px;">
                <li>Buka Google Drive Anda dan cari file audio tersebut.</li>
                <li>Klik kanan pada file atau klik tombol tiga titik, lalu pilih <b>Bagikan (Share)</b> &rarr; <b>Bagikan (Share)</b>.</li>
                <li>Di bagian <b>Akses Umum (General Access)</b>, ubah status dari <b>Dibatasi (Restricted)</b> menjadi <b>Siapa saja yang memiliki link (Anyone with the link)</b>.</li>
                <li>Pastikan perannya disetel sebagai <b>Pelihat (Viewer)</b>.</li>
                <li>Klik <b>Selesai (Done)</b>.</li>
              </ol>
              <p style="font-size: 14px; color: #7f1d1d; margin-bottom: 0;">Setelah melakukan langkah-langkah di atas, silakan <b>muat ulang (refresh)</b> halaman ucapan ulang tahun ini!</p>
            </div>
          `);
          return;
        }

        // 2. Check if there is a virus scan confirmation token (for large files)
        const confirmMatch = text.match(/confirm=([0-9A-Za-z_-]+)/);
        if (confirmMatch) {
          const confirmToken = confirmMatch[1];
          console.log(`[Audio Proxy] Bypassing virus scan using confirm token: ${confirmToken}`);
          
          const secondUrl = `https://docs.google.com/uc?export=download&id=${fileId}&confirm=${confirmToken}`;
          const headers: Record<string, string> = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          };
          if (cookies.length > 0) {
            headers["Cookie"] = cookies.join("; ");
          }

          finalResponse = await fetch(secondUrl, { headers });
        } else {
          console.error(`[Audio Proxy] Google Drive returned HTML but no confirmation token found.`);
          res.status(400).send("Gagal memuat lagu. Pastikan link Google Drive sudah diatur ke Publik.");
          return;
        }
      }

      if (!finalResponse.ok) {
        console.error(`[Audio Proxy] Google Drive download failed with status: ${finalResponse.status}`);
        res.status(finalResponse.status).send(`Gagal mengunduh audio dari Google Drive: ${finalResponse.statusText}`);
        return;
      }

      // Stream the response back
      const finalContentType = finalResponse.headers.get("content-type") || "audio/mpeg";
      const contentLength = finalResponse.headers.get("content-length");

      console.log(`[Audio Proxy] Streaming audio back - Content-Type: ${finalContentType}, Content-Length: ${contentLength}`);

      res.setHeader("Content-Type", finalContentType);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Accept-Ranges", "bytes");

      if (finalResponse.body) {
        Readable.fromWeb(finalResponse.body as any).pipe(res);
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

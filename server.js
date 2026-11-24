// server.js
// Express-Server für die statische Website in ./public.
// Hash-Routing läuft client-seitig — der Server liefert nur Assets + index.html.

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 2412;
const PUBLIC_DIR = path.join(__dirname, "public");

// Basis-Security-Header
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Health-Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Statische Website mit sinnvollem Caching
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ["html"],
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (/\.(css|js|svg|png|jpe?g|webp|ico|woff2?)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// 404 für unbekannte Pfade
app.use((req, res) => {
  res
    .status(404)
    .type("text/plain; charset=utf-8")
    .send("404 — Nicht gefunden");
});

// Zentrale Fehlerbehandlung
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res
    .status(500)
    .type("text/plain; charset=utf-8")
    .send("500 — Interner Serverfehler");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Weihnachtszeit in Britz → http://localhost:${PORT}`);
});

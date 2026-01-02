import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Installer les globales Remix (fetch, etc.)
installGlobals();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importer le build Remix
// On utilise un import dynamique pour Ã©viter les erreurs au chargement si le build est corrompu
const build = await import("./build/server/index.js");

const app = express();

// Servir les fichiers statiques
app.use(
  "/assets",
  express.static(path.join(__dirname, "build/client/assets"), {
    immutable: true,
    maxAge: "1y",
  })
);
app.use(express.static(path.join(__dirname, "build/client")));

// GÃ©rer toutes les requÃªtes avec Remix
app.all(
  "*",
  createRequestHandler({
    build: build.default || build,
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 5173;
app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur prÃªt sur http://0.0.0.0:${port}`);
});
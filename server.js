import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Installer les globales Remix
installGlobals();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
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

  try {
    // Import dynamique du build
    const build = await import("./build/server/index.js");
    
    app.all(
      "*",
      createRequestHandler({
        build: build.default || build,
        mode: process.env.NODE_ENV,
      })
    );
  } catch (error) {
    console.error("Erreur lors du chargement du build Remix:", error);
    // Fallback minimaliste pour éviter le crash du conteneur
    app.get("*", (req, res) => res.status(500).send("Erreur de chargement de l'application."));
  }

  const port = process.env.PORT || 5173;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Serveur prêt sur http://0.0.0.0:${port}`);
  });
}

startServer().catch(console.error);

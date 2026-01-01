import { createRequestHandler } from "@remix-run/node";
import * as build from "./build/server/index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir les fichiers statiques du client
app.use(
  "/assets",
  express.static(path.join(__dirname, "build/client/assets"), {
    immutable: true,
    maxAge: "1y",
  })
);
app.use(express.static(path.join(__dirname, "build/client")));

// Gérer toutes les autres requêtes avec Remix
app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 5173;
app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur prêt sur http://0.0.0.0:${port}`);
});

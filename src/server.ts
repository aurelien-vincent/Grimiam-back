import app from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/mongoose.js";

async function startServer(): Promise<void> {
  await connectToDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`API démarrée sur le port ${env.PORT}`);
  });

  let isShuttingDown = false;

  async function stopServer(signal: string): Promise<void> {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Signal ${signal} reçu, arrêt du serveur…`);

    server.close((error) => {
      void disconnectFromDatabase()
        .then(() => {
          process.exitCode = error ? 1 : 0;
        })
        .catch(() => {
          process.exitCode = 1;
        });
    });
  }

  process.on("SIGINT", () => void stopServer("SIGINT"));
  process.on("SIGTERM", () => void stopServer("SIGTERM"));
}

void startServer().catch(() => {
  // Ne pas afficher l'URI MongoDB ou d'autres secrets dans les logs.
  console.error("Impossible de démarrer l'API : vérifie la connexion MongoDB et la configuration.");
  process.exitCode = 1;
});

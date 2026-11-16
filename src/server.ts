import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`API démarrée sur le port ${env.PORT}`);
});

function stopServer(signal: string) {
  console.log(`Signal ${signal} reçu, arrêt du serveur…`);

  server.close((error) => {
    if (error) {
      console.error("Erreur pendant l’arrêt du serveur");
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
}

process.on("SIGINT", () => stopServer("SIGINT"));
process.on("SIGTERM", () => stopServer("SIGTERM"));
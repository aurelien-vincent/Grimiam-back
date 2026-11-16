import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    // En production, créer les index pendant le déploiement plutôt qu'au démarrage.
    autoIndex: env.NODE_ENV !== "production",
  });

  console.log("Connexion à MongoDB établie");
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
}

mongoose.connection.on("disconnected", () => {
  console.error("Connexion à MongoDB interrompue");
});

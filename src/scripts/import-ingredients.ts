import { readFile } from "node:fs/promises";
import { IngredientModel } from "../modules/ingredients/ingredient.model.js";
import { connectToDatabase, disconnectFromDatabase } from "../db/mongoose.js";

interface IngredientSeed {
  name: string;
  normalizedName: string;
  aliases: string[];
}

async function importIngredients(): Promise<void> {
  const seedUrl = new URL("../../seeds/ingredients.fr.json", import.meta.url);
  const json = await readFile(seedUrl, "utf8");
  const ingredients = JSON.parse(json) as IngredientSeed[];

  await connectToDatabase();

  try {
    const result = await IngredientModel.bulkWrite(
      ingredients.map((ingredient) => ({
        updateOne: {
          filter: { normalizedName: ingredient.normalizedName },
          update: { $setOnInsert: ingredient },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    console.log(
      `Import terminé : ${result.upsertedCount} ingrédient(s) ajouté(s), ` +
        `${result.matchedCount} déjà présent(s).`,
    );
  } finally {
    await disconnectFromDatabase();
  }
}

void importIngredients().catch(() => {
  console.error("Import des ingrédients impossible : vérifie la base et le fichier JSON.");
  process.exitCode = 1;
});

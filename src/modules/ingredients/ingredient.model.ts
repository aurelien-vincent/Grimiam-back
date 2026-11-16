import { model, Schema, Types } from "mongoose";

export interface Ingredient {
  name: string;
  normalizedName: string;
  aliases: string[];
  createdBy?: Types.ObjectId;
}

const ingredientSchema = new Schema<Ingredient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    // Valeur normalisée par le service (minuscules, espaces nettoyés, etc.).
    // L'index unique évite les doublons créés simultanément.
    normalizedName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    aliases: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ingredientSchema.index({ normalizedName: 1 }, { unique: true });
ingredientSchema.index({ name: "text", aliases: "text" });

export const IngredientModel = model<Ingredient>("Ingredient", ingredientSchema);

import { model, Schema, Types } from "mongoose";

export const RECIPE_UNITS = [
  "g",
  "kg",
  "ml",
  "cl",
  "l",
  "tsp",
  "tbsp",
  "piece",
  "pinch",
  "to_taste",
] as const;

export type RecipeUnit = (typeof RECIPE_UNITS)[number];

export interface RecipeIngredient {
  ingredientId: Types.ObjectId;
  nameSnapshot: string;
  quantity?: number;
  unit: RecipeUnit;
  note?: string;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  durationSeconds?: number;
  ingredientLineIds: Types.ObjectId[];
}

export interface Recipe {
  ownerId: Types.ObjectId;
  title: string;
  description?: string;
  servings: number;
  preparationMinutes: number;
  cookingMinutes: number;
  visibility: "private" | "public";
  tags: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

const recipeIngredientSchema = new Schema<RecipeIngredient>(
  {
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    // Copie du nom au moment de la création pour garder une recette lisible
    // même si l'entrée du catalogue est renommée par la suite.
    nameSnapshot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    quantity: {
      type: Number,
      min: 0,
      default: undefined,
    },
    unit: {
      type: String,
      enum: RECIPE_UNITS,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 250,
      default: undefined,
    },
  },
  { _id: true },
);

const recipeStepSchema = new Schema<RecipeStep>(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    durationSeconds: {
      type: Number,
      min: 1,
      default: undefined,
    },
    // Références aux sous-documents ingredients de cette recette.
    ingredientLineIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { _id: true },
);

const recipeSchema = new Schema<Recipe>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: undefined,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
    preparationMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 100_000,
    },
    cookingMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 100_000,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [recipeIngredientSchema],
      default: [],
    },
    steps: {
      type: [recipeStepSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

recipeSchema.index({ ownerId: 1, updatedAt: -1 });
recipeSchema.index({ visibility: 1, createdAt: -1 });

export const RecipeModel = model<Recipe>("Recipe", recipeSchema);

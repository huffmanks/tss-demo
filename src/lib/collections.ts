import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";

import {
  categorySchema,
  cuisineSchema,
  ingredientSchema,
  instructionSchema,
  recipeSchema,
  tagSchema,
} from "@/db/entities";
import { createCategory, deleteCategory, updateCategory } from "@/fn/categories";
import { createCuisine, deleteCuisine, updateCuisine } from "@/fn/cuisines";
import { createIngredient, deleteIngredient, updateIngredient } from "@/fn/ingredients";
import { createInstruction, deleteInstruction, updateInstruction } from "@/fn/instructions";
import { createRecipe, deleteRecipe, updateRecipe } from "@/fn/recipes";
import { createTag, deleteTag, updateTag } from "@/fn/tags";

// Construct absolute URL for Electric sync
// In browser: uses window.location.origin
// Fallback for SSR or other contexts
const getElectricUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/electric`;
  }
  // Fallback for SSR
  return `${process.env.VITE_APP_URL}/api/electric`;
};

export const recipesCollection = createCollection(
  electricCollectionOptions({
    id: "recipes",
    schema: recipeSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "recipes" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createRecipe({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateRecipe({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteRecipe({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

export const categoriesCollection = createCollection(
  electricCollectionOptions({
    id: "categories",
    schema: categorySchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "categories" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createCategory({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateCategory({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteCategory({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

export const cuisnesCollection = createCollection(
  electricCollectionOptions({
    id: "cuisnes",
    schema: cuisineSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "cuisnes" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createCuisine({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateCuisine({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteCuisine({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

export const tagsCollection = createCollection(
  electricCollectionOptions({
    id: "tags",
    schema: tagSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "tags" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createTag({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateTag({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteTag({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

export const ingredientsCollection = createCollection(
  electricCollectionOptions({
    id: "ingredients",
    schema: ingredientSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "ingredients" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createIngredient({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateIngredient({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteIngredient({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

export const instructionsCollection = createCollection(
  electricCollectionOptions({
    id: "instructions",
    schema: instructionSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "instructions" },
      onError: () => {},
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createInstruction({ data: newItem });
      return { txid };
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateInstruction({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteInstruction({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);

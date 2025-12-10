import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema/auth";

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    image: text("image").notNull(),
    prepTime: integer("prep_time"),
    cookTime: integer("cook_time"),
    totalTime: integer("total_time"),
    servingSize: integer("serving_size").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    categoryId: uuid("category_id")
      .references(() => categories.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("recipes_userId_idx").on(table.userId)]
);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const cuisines = pgTable("cuisines", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const recipeCuisines = pgTable("recipe_cuisines", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id)
    .notNull(),
  cuisineId: uuid("cuisine_id")
    .references(() => cuisines.id, { onDelete: "cascade" })
    .notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const recipeTags = pgTable("recipe_tags", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id)
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
});

export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  amount: integer("amount"),
  unit: text("unit"),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  ingredientId: uuid("ingredient_id")
    .references(() => ingredients.id, { onDelete: "cascade" })
    .notNull(),
});

export const instructions = pgTable("instructions", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  isHeading: boolean("isHeading").default(false).notNull(),
  order: integer("order").notNull(),
});

export const recipeInstructions = pgTable("recipe_instructions", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  instructionId: uuid("instruction_id")
    .references(() => instructions.id, { onDelete: "cascade" })
    .notNull(),
});

export const recipeRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
  }),
  //   cuisines: many(cuisines),
  //   tags: many(tags),
  cuisines: many(recipeCuisines),
  tags: many(recipeTags),
  ingredients: many(ingredients),
  instructions: many(instructions),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  recipes: many(recipes),
}));

export const cuisineRelations = relations(cuisines, ({ many }) => ({
  recipes: many(recipeCuisines),
}));

export const recipeCuisineRelations = relations(recipeCuisines, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeCuisines.recipeId],
    references: [recipes.id],
  }),
  cuisine: one(cuisines, {
    fields: [recipeCuisines.recipeId],
    references: [cuisines.id],
  }),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  recipes: many(recipeTags),
}));

export const recipeTagRelations = relations(recipeTags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeTags.recipeId],
    references: [recipes.id],
  }),
  tag: one(tags, {
    fields: [recipeTags.tagId],
    references: [tags.id],
  }),
}));

export const ingredientRelations = relations(ingredients, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
  }),
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
  ingredient: one(ingredients, {
    fields: [recipeIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export const instructionRelations = relations(instructions, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [instructions.recipeId],
    references: [recipes.id],
  }),
  instructions: many(recipeInstructions),
}));

export const recipeInstructionRelations = relations(recipeInstructions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeInstructions.recipeId],
    references: [recipes.id],
  }),
  instruction: one(instructions, {
    fields: [recipeInstructions.instructionId],
    references: [instructions.id],
  }),
}));

export type NewCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;

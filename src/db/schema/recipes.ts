import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { organizations, teams, users } from "./auth.ts";

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    prepTime: integer("prep_time"),
    cookTime: integer("cook_time"),
    servingSize: integer("serving_size").notNull(),
    authorNotes: text("author_notes"),
    nutrition: jsonb("nutrition"),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("recipes_userId_idx").on(table.userId),
    index("recipes_teamId_idx").on(table.teamId),
    unique().on(table.teamId, table.title),
    unique().on(table.teamId, table.slug),
  ]
);

export const images = pgTable("images", {
  id: uuid("id").primaryKey(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const recipeImages = pgTable(
  "recipe_images",
  {
    id: uuid("id").primaryKey(),
    position: integer("position").notNull(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    imageId: uuid("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("recipe_images_recipe_id_idx").on(table.recipeId),
    index("recipe_images_image_id_idx").on(table.imageId),
    index("recipe_images_team_id_idx").on(table.teamId),
    unique("recipe_images_recipe_position_unique").on(table.recipeId, table.position),
  ]
);

export const recipeShares = pgTable(
  "recipe_shares",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("recipe_shares_recipe_id_idx").on(table.recipeId),
    index("recipe_shares_organization_id_idx").on(table.organizationId),
    index("recipe_shares_team_id_idx").on(table.teamId),
    unique("recipe_shares_recipe_org_unique").on(table.recipeId, table.organizationId),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("categories_team_title_unique").on(table.teamId, table.title),
    index("categories_team_id_idx").on(table.teamId),
  ]
);

export const recipeCategories = pgTable(
  "recipe_categories",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("recipe_categories_recipe_category_unique").on(table.recipeId, table.categoryId),
    index("recipe_categories_category_id_idx").on(table.categoryId),
    index("recipe_categories_recipe_id_idx").on(table.recipeId),
    index("recipe_categories_team_id_idx").on(table.teamId),
  ]
);

export const cuisines = pgTable(
  "cuisines",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("cuisines_team_title_unique").on(table.teamId, table.title),
    index("cuisines_team_id_idx").on(table.teamId),
  ]
);

export const recipeCuisines = pgTable(
  "recipe_cuisines",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    cuisineId: uuid("cuisine_id")
      .references(() => cuisines.id, { onDelete: "cascade" })
      .notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("recipe_cuisines_recipe_cuisine_unique").on(table.recipeId, table.cuisineId),
    index("recipe_cuisines_cuisine_id_idx").on(table.cuisineId),
    index("recipe_cuisines_recipe_id_idx").on(table.recipeId),
    index("recipe_cuisines_team_id_idx").on(table.teamId),
  ]
);

export const diets = pgTable(
  "diets",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("diets_team_title_unique").on(table.teamId, table.title),
    index("diets_team_id_idx").on(table.teamId),
  ]
);

export const recipeDiets = pgTable(
  "recipe_diets",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    dietId: uuid("diet_id")
      .references(() => diets.id, { onDelete: "cascade" })
      .notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("recipe_diets_recipe_diet_unique").on(table.recipeId, table.dietId),
    index("recipe_diets_diet_id_idx").on(table.dietId),
    index("recipe_diets_recipe_id_idx").on(table.recipeId),
    index("recipe_diets_team_id_idx").on(table.teamId),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("tags_team_title_unique").on(table.teamId, table.title),
    index("tags_team_id_idx").on(table.teamId),
  ]
);

export const recipeTags = pgTable(
  "recipe_tags",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("recipe_tags_recipe_tag_unique").on(table.recipeId, table.tagId),
    index("recipe_tags_tag_id_idx").on(table.tagId),
    index("recipe_tags_recipe_id_idx").on(table.recipeId),
    index("recipe_tags_team_id_idx").on(table.teamId),
  ]
);

export const units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    abbreviation: text("abbreviation").notNull(),
    type: text("type").notNull(),
    system: text("system").notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("units_name_team_unique").on(table.teamId, table.name),
    unique("units_abbr_team_unique").on(table.teamId, table.abbreviation),
    index("units_team_id_idx").on(table.teamId),
  ]
);

export const ingredientSections = pgTable(
  "ingredient_sections",
  {
    id: uuid("id").primaryKey(),
    title: text("title"),
    position: integer("position").notNull(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("ingredient_sections_recipe_position_unique").on(table.recipeId, table.position),
    index("ingredient_sections_recipe_id_idx").on(table.recipeId),
  ]
);

export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid("id").primaryKey(),
    amount: numeric("amount", { precision: 9, scale: 3 }),
    name: text("name").notNull(),
    position: integer("position").notNull(),
    sectionId: uuid("section_id")
      .references(() => ingredientSections.id, { onDelete: "cascade" })
      .notNull(),
    unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
  },
  (table) => [
    index("ingredients_section_id_idx").on(table.sectionId),
    unique("ingredients_section_position_unique").on(table.sectionId, table.position),
    index("ingredients_unit_id_idx").on(table.unitId),
  ]
);

export const instructionSections = pgTable(
  "instruction_sections",
  {
    id: uuid("id").primaryKey(),
    title: text("title"),
    position: integer("position").notNull(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    unique("instruction_sections_recipe_position_unique").on(table.recipeId, table.position),
    index("instruction_sections_recipe_id_idx").on(table.recipeId),
  ]
);

export const instructions = pgTable(
  "instructions",
  {
    id: uuid("id").primaryKey(),
    content: text("content").notNull(),
    position: integer("position").notNull(),
    sectionId: uuid("section_id")
      .references(() => instructionSections.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    index("instructions_section_id_idx").on(table.sectionId),
    unique("instructions_section_position_unique").on(table.sectionId, table.position),
  ]
);

export const recipeRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  categories: many(recipeCategories),
  cuisines: many(recipeCuisines),
  tags: many(recipeTags),
  ingredientSections: many(ingredientSections),
  instructionSections: many(instructionSections),
  images: many(recipeImages),
}));

export const recipeSharesRelations = relations(recipeShares, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeShares.recipeId],
    references: [recipes.id],
  }),
  organization: one(organizations, {
    fields: [recipeShares.organizationId],
    references: [organizations.id],
  }),
}));

export const imagesRelations = relations(images, ({ many }) => ({
  recipeImages: many(recipeImages),
}));

export const recipeImagesRelations = relations(recipeImages, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeImages.recipeId],
    references: [recipes.id],
  }),
  image: one(images, {
    fields: [recipeImages.imageId],
    references: [images.id],
  }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  recipes: many(recipeCategories),
}));

export const recipeCategoryRelations = relations(recipeCategories, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeCategories.recipeId],
    references: [recipes.id],
  }),
  category: one(categories, {
    fields: [recipeCategories.categoryId],
    references: [categories.id],
  }),
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
    fields: [recipeCuisines.cuisineId],
    references: [cuisines.id],
  }),
}));

export const dietsRelations = relations(diets, ({ many }) => ({
  recipeDiets: many(recipeDiets),
}));

export const recipeDietsRelations = relations(recipeDiets, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeDiets.recipeId],
    references: [recipes.id],
  }),
  diet: one(diets, {
    fields: [recipeDiets.dietId],
    references: [diets.id],
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

export const unitsRelations = relations(units, ({ many }) => ({
  ingredients: many(ingredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  ingredientSection: one(ingredientSections, {
    fields: [ingredients.sectionId],
    references: [ingredientSections.id],
  }),
  unit: one(units, {
    fields: [ingredients.unitId],
    references: [units.id],
  }),
}));

export const ingredientSectionsRelations = relations(ingredientSections, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredientSections.recipeId],
    references: [recipes.id],
  }),
}));

export const instructionSectionsRelations = relations(instructionSections, ({ one }) => ({
  recipe: one(recipes, {
    fields: [instructionSections.recipeId],
    references: [recipes.id],
  }),
}));

export const instructionsRelations = relations(instructions, ({ one }) => ({
  instructionSection: one(instructionSections, {
    fields: [instructions.sectionId],
    references: [instructionSections.id],
  }),
}));

export type NewRecipe = typeof recipes.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCuisine = typeof cuisines.$inferInsert;
export type Cuisine = typeof cuisines.$inferSelect;
export type NewDiet = typeof diets.$inferInsert;
export type Diet = typeof diets.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Tag = typeof tags.$inferSelect;

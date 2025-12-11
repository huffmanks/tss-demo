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

import { organizations, users } from "@/db/schema/auth";
import {
  categoryEnum,
  cuisineEnum,
  dietEnum,
  unitAbbrevEnum,
  unitNameEnum,
  unitSystemEnum,
  unitTypeEnum,
} from "@/db/schema/enums";

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    category: categoryEnum("category").notNull(),
    prepTime: integer("prep_time"),
    cookTime: integer("cook_time"),
    servingSize: integer("serving_size").notNull(),
    authorNotes: text("author_notes"),
    nutrition: jsonb("nutrition"),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("recipes_userId_idx").on(table.userId),
    unique().on(table.organizationId, table.title),
    unique().on(table.organizationId, table.slug),
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
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    imageId: uuid("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    index("recipe_images_recipeId_idx").on(table.recipeId),
    unique("recipe_images_recipeId_position_unique").on(table.recipeId, table.position),
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
  },
  (table) => [
    index("recipe_shares_organizationId_idx").on(table.organizationId),
    unique("recipe_shares_recipe_organization_unique").on(table.recipeId, table.organizationId),
  ]
);

export const cuisines = pgTable("cuisines", {
  id: uuid("id").primaryKey(),
  title: cuisineEnum("title").notNull(),
});

export const recipeCuisines = pgTable(
  "recipe_cuisines",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id)
      .notNull(),
    cuisineId: uuid("cuisine_id")
      .references(() => cuisines.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    index("recipe_cuisines_recipeId_cuisineId_unique_idx").on(table.recipeId, table.cuisineId),
  ]
);

export const diets = pgTable("diets", {
  id: uuid("id").primaryKey(),
  title: dietEnum("title").notNull(),
});

export const recipeDiets = pgTable(
  "recipe_diets",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id)
      .notNull(),
    dietId: uuid("diet_id")
      .references(() => diets.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("recipe_diets_recipeId_dietId_unique_idx").on(table.recipeId, table.dietId)]
);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull().unique(),
});

export const recipeTags = pgTable(
  "recipe_tags",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("recipe_tags_recipeId_tagId_unique_idx").on(table.recipeId, table.tagId)]
);

export const units = pgTable("units", {
  id: uuid("id").primaryKey(),
  name: unitNameEnum("name").notNull(),
  abbreviation: unitAbbrevEnum("abbrev").notNull(),
  type: unitTypeEnum("type").notNull(),
  system: unitSystemEnum("system").notNull(),
});

export const ingredientSections = pgTable(
  "ingredient_sections",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title"),
    position: integer("position").notNull(),
  },
  (table) => [
    unique("ingredient_sections_recipeId_position_unique").on(table.recipeId, table.position),
  ]
);

export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid("id").primaryKey(),
    amount: numeric("amount", { precision: 9, scale: 3 }),
    name: text("name").notNull(),
    sectionId: uuid("section_id")
      .references(() => ingredientSections.id, { onDelete: "cascade" })
      .notNull(),
    position: integer("position").notNull(),
    unitId: uuid("unit_id").references(() => units.id),
  },
  (table) => [
    index("ingredients_sectionId_idx").on(table.sectionId),
    unique("ingredients_section_position_unique").on(table.sectionId, table.position),
  ]
);

export const instructionSections = pgTable(
  "instruction_sections",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title"),
    position: integer("position").notNull(),
  },
  (table) => [
    unique("instruction_sections_recipeId_position_unique").on(table.recipeId, table.position),
  ]
);

export const instructions = pgTable(
  "instructions",
  {
    id: uuid("id").primaryKey(),
    sectionId: uuid("section_id")
      .references(() => instructionSections.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [
    index("instructions_sectionId_idx").on(table.sectionId),
    unique("instructions_section_position_unique").on(table.sectionId, table.position),
  ]
);

export const recipeRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
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
export type NewCuisine = typeof cuisines.$inferInsert;
export type Cuisine = typeof cuisines.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Tag = typeof tags.$inferSelect;

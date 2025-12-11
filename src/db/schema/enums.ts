import { pgEnum } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "breakfast",
  "brunch",
  "lunch",
  "dinner",
  "dessert",
  "drink",
  "snack",
  "side",
]);

export const cuisineEnum = pgEnum("cuisine", [
  "italian",
  "mexican",
  "american",
  "thai",
  "indian",
  "japanese",
  "korean",
  "french",
  "greek",
  "other",
]);

export const dietEnum = pgEnum("diet", [
  "dairy-free",
  "gluten-free",
  "keto",
  "low-carb",
  "nut-free",
  "paleo",
  "vegan",
  "vegetarian",
]);

export const unitTypeEnum = pgEnum("unit_type", ["weight", "volume", "count"]);

export const unitSystemEnum = pgEnum("unit_system", ["metric", "imperial"]);

export const unitNameEnum = pgEnum("unit_name", [
  "gram",
  "kilogram",
  "milliliter",
  "liter",
  "teaspoon",
  "tablespoon",
  "cup",
  "ounce",
  "pound",
  "piece",
]);

export const unitAbbrevEnum = pgEnum("unit_abbrev", [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "c",
  "oz",
  "lb",
  "pc",
]);

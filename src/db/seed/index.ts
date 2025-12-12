import { drizzle } from "drizzle-orm/node-postgres";

import { categories, cuisines, diets, units } from "../schema/recipes.ts";
import { initialCategories, initialCuisines, initialDiets, initialUnits } from "./data.ts";

const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    categories,
    cuisines,
    diets,
    units,
  },
});

async function main() {
  for await (const category of initialCategories) {
    await db.insert(categories).values(category).execute();
  }

  for await (const cuisine of initialCuisines) {
    await db.insert(cuisines).values(cuisine).execute();
  }

  for await (const diet of initialDiets) {
    await db.insert(diets).values(diet).execute();
  }

  for await (const unit of initialUnits) {
    await db.insert(units).values(unit).execute();
  }

  await db.$client.end();
}

main().catch((error) => {
  console.log(error);
  console.error("Seeding failed!");
});

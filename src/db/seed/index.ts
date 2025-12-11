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
  if (process.env.NODE_ENV === "production") {
    const result = await db
      .execute(`select exists(select 1 from seeds) as seeded`)
      .catch(async () => {
        await db.execute(
          `create table if not exists seeds (id int primary key, ran_at timestamptz)`
        );
        return { rows: [{ seeded: false }] };
      });

    if (result.rows[0].seeded) {
      console.log("Seed already ran, skipping.");
      process.exit(0);
    }
  }

  for await (const category of initialCategories) {
    await db.insert(categories).values(category);
  }

  for await (const cuisine of initialCuisines) {
    await db.insert(cuisines).values(cuisine);
  }

  for await (const diet of initialDiets) {
    await db.insert(diets).values(diet);
  }

  for await (const unit of initialUnits) {
    await db.insert(units).values(unit);
  }

  if (process.env.NODE_ENV === "production") {
    await db.execute(`insert into seeds (id, ran_at) values (1, now())`);
  }

  await db.$client.end();
}

main();

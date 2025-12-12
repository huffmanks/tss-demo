import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const db = drizzle(connectionString);

async function runMigration() {
  await migrate(db, {
    migrationsFolder: "./db/migrations",
  });
  console.log("Migrations applied successfully!");
  await db.$client.end();
}

runMigration().catch((error) => {
  console.log(error);
  console.error("Migration failed!");
});

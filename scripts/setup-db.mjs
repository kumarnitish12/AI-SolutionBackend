import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env", override: true });

const { Client } = pg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in backend/.env");
  }

  const client = new Client({ connectionString });
  await client.connect();

  const schemaSql = fs.readFileSync(path.join("sql", "schema.sql"), "utf8");
  const seedSql = fs.readFileSync(path.join("sql", "seed.sql"), "utf8");

  await client.query(schemaSql);
  await client.query(seedSql);
  await client.end();

  console.log("Database setup completed: schema + seed applied.");
}

main().catch((error) => {
  console.error("Database setup failed:", error.message);
  process.exit(1);
});

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it in backend/.env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

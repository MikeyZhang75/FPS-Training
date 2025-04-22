import { env } from "@/lib/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./auth-schema";
import * as gameSchema from "./game-schema";

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql, schema: { ...schema, ...gameSchema } });

export default db;

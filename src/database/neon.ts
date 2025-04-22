import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./auth-schema";
import * as gameSchema from "./game-schema";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { ...schema, ...gameSchema } });

export default db;

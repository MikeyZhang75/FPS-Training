import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./auth-schema";
import * as gameSchema from "./game-schema";

const pool = new Pool({
	connectionString: env.DB_URL,
});
const db = drizzle({ client: pool, schema: { ...schema, ...gameSchema } });

export default db;

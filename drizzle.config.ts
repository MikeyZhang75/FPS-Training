import { env } from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: ["./src/database/auth-schema.ts", "./src/database/game-schema.ts"],
	dialect: "postgresql",
	dbCredentials: {
		url: env.DB_URL,
	},
});

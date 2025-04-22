import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	DB_URL: str(),
	BETTER_AUTH_SECRET: str(),
});

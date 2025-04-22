import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: str(),
	DIRECT_URL: str(),
	BETTER_AUTH_SECRET: str(),
});

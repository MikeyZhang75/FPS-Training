import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { recordController } from "./controllers/record.controller";
import { statsController } from "./controllers/stats.controller";
import betterAuthView from "./libs/auth/auth-view";

const app = new Elysia({ prefix: "/api" })
	.use(cors())
	.all("/auth/*", betterAuthView)
	.use(
		swagger({
			exclude: ["/api/swagger", "/api/swagger/json"],
		}),
	)
	.use(recordController)
	.use(statsController);

export const GET = app.handle;
export const POST = app.handle;

export type API = typeof app;

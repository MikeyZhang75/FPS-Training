import { swagger } from "@elysiajs/swagger";
// app/api/[[...slugs]]/route.ts
import { Elysia } from "elysia";
import { recordController } from "./controllers/record.controller";
import betterAuthView from "./libs/auth/auth-view";

const app = new Elysia({ prefix: "/api" })
	.all("/auth/*", betterAuthView)
	.use(
		swagger({
			exclude: ["/api/swagger", "/api/swagger/json"],
		}),
	)
	.use(recordController);

export const GET = app.handle;
export const POST = app.handle;

export type API = typeof app;

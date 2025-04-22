// app/api/[[...slugs]]/route.ts
import { Elysia, t } from "elysia";
import betterAuthView from "./libs/auth/auth-view";

const app = new Elysia({ prefix: "/api" })
	.all("/auth/*", betterAuthView)
	.get("/", () => "hello Next")
	.post("/", ({ body }) => body, {
		body: t.Object({
			name: t.String(),
		}),
	});

export const GET = app.handle;
export const POST = app.handle;

export type API = typeof app;

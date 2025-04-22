import { auth } from "@/lib/auth";
import type { Session, User } from "better-auth/types";
// src/middlewares/user-middleware.ts
import type { Context } from "elysia";

export const userMiddleware = async (c: Context) => {
	// Pull the session from headers (cookies or Authorization)
	const session = await auth.api.getSession({
		headers: c.request.headers,
		query: {
			disableCookieCache: true,
		},
	});
	if (!session) {
		c.set.status = 401;
		return { success: "error", message: "Unauthorized" };
	}

	// Attach user and session to context for handlers
	return {
		user: session.user as User,
		session: session.session as Session,
	};
};

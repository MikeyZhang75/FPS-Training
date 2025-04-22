import { user } from "@/database/auth-schema";
import { record } from "@/database/game-schema";
import db from "@/database/neon";
import { eq } from "drizzle-orm";
import { Elysia, error } from "elysia";
import { userMiddleware } from "../middlewares/user-middleware";

export const statsController = new Elysia({ prefix: "/stats" })
	.derive(userMiddleware)
	.get("/me", async ({ user }) => {
		if (!user) {
			return error(401, {
				success: false,
				message: "Unauthorized",
			});
		}
		const records = await db
			.select()
			.from(record)
			.where(eq(record.userId, user.id));

		return {
			success: true,
			data: records,
		};
	})
	.get("/", async () => {
		// Join record with user to get user names
		const records = await db
			.select({
				id: record.id,
				userId: record.userId,
				gridSize: record.gridSize,
				startTime: record.startTime,
				endTime: record.endTime,
				duration: record.duration,
				createdAt: record.createdAt,
				userName: user.name,
			})
			.from(record)
			.leftJoin(user, eq(record.userId, user.id));

		return {
			success: true,
			data: records,
		};
	});

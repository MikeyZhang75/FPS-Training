import { record } from "@/database/game-schema";
import { model } from "@/database/model";
import db from "@/database/neon";
import { eq } from "drizzle-orm";
import { Elysia, error, t } from "elysia";
import { userMiddleware } from "../middlewares/user-middleware";

const { record: insertRecord } = model.insert;

export const recordController = new Elysia({ prefix: "/record" })
	.derive(userMiddleware)
	.get("/", async ({ user }) => {
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
	.post(
		"/",
		async ({ body, user }) => {
			try {
				const { gridSize, startTime, endTime } = body;

				// Check if user is authenticated
				if (!user) {
					return error(401, {
						success: false,
						message: "Unauthorized",
					});
				}

				// Insert record into database
				const newRecord = await db
					.insert(record)
					.values({
						userId: user.id,
						gridSize,
						startTime,
						endTime,
						duration: Number(endTime) - Number(startTime),
					})
					.returning();

				return {
					success: true,
					data: newRecord[0],
				};
			} catch (e) {
				console.error("Error inserting record:", e);
				return error(500, {
					success: false,
					message: "Failed to insert record",
				});
			}
		},
		{
			body: t.Object({
				gridSize: insertRecord.gridSize,
				startTime: insertRecord.startTime,
				endTime: insertRecord.endTime,
			}),
		},
	);

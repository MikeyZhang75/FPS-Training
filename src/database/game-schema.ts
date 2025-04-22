import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const record = pgTable(
	"record",
	{
		id: text("id")
			.$defaultFn(() => randomUUID())
			.primaryKey(),
		userId: text("user_id").notNull(),
		gridSize: integer("grid_size").notNull(),
		startTime: text("start_time").notNull(),
		endTime: text("end_time").notNull(),
		duration: integer("duration").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [check("grid_size_check", sql`${table.gridSize} IN (4, 5, 6)`)],
);

export const GameTable = {
	record,
} as const;

export type GameTable = typeof GameTable;

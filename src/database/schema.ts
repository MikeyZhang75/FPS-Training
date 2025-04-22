import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { createId } from "@paralleldrive/cuid2";

export const user = pgTable("user", {
	id: varchar("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	username: varchar("username").notNull().unique(),
	password: varchar("password").notNull(),
	email: varchar("email").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const table = {
	user,
} as const;

export type Table = typeof table;

import { GameTable } from "./game-schema";
import { spreads } from "./utils";

export const model = {
	insert: spreads(
		{
			record: GameTable.record,
		},
		"insert",
	),
	select: spreads(
		{
			record: GameTable.record,
		},
		"select",
	),
} as const;

import { edenClient } from "./eden.client";

export const statsService = {
	currentUserStats: async () => {
		return await edenClient.stats.me.get();
	},
	allUsersStats: async () => {
		return await edenClient.stats.index.get();
	},
};

export type currentUserStatsRequest = Parameters<
	typeof statsService.currentUserStats
>;
export type currentUserStatsResponse = Awaited<
	NonNullable<
		Awaited<ReturnType<typeof statsService.currentUserStats>>["data"]
	>["data"]
>;

export type allUsersStatsRequest = Parameters<
	typeof statsService.allUsersStats
>;
export type allUsersStatsResponse = Awaited<
	NonNullable<
		Awaited<ReturnType<typeof statsService.allUsersStats>>["data"]
	>["data"]
>;

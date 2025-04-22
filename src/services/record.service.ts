import { edenClient } from "./eden.client";

export const recordService = {
	create: async (
		payload: Parameters<typeof edenClient.record.index.post>[0],
	) => {
		return await edenClient.record.index.post(payload);
	},
	findAll: async () => {
		return await edenClient.record.index.get();
	},
};

export type createRequest = Parameters<typeof recordService.create>;
export type createResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof recordService.create>>["data"]>["data"]
>;

export type findAllRequest = Parameters<typeof recordService.findAll>;
export type findAllResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof recordService.findAll>>["data"]>["data"]
>;

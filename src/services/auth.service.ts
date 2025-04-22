import { edenClient } from "./eden.client";

export const authService = {
	login: async (payload: Parameters<typeof edenClient.auth.login.post>[0]) => {
		return await edenClient.auth.login.post(payload);
	},
	logout: async () => {
		return await edenClient.auth.logout.post();
	},
	refresh: async () => {
		return await edenClient.auth.refresh.get();
	},
	me: async () => {
		return await edenClient.auth.me.get();
	},
};

export type loginRequest = Parameters<typeof authService.login>;
export type loginResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof authService.login>>["data"]>["data"]
>;

export type logoutRequest = Parameters<typeof authService.logout>;
export type logoutResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof authService.logout>>["data"]>
>;

export type refreshRequest = Parameters<typeof authService.refresh>;
export type refreshResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof authService.refresh>>["data"]>["data"]
>;

export type meRequest = Parameters<typeof authService.me>;
export type meResponse = Awaited<
	NonNullable<Awaited<ReturnType<typeof authService.me>>["data"]>["data"]
>;

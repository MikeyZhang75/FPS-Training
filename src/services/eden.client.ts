import type { API } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

const host =
	typeof window === "undefined"
		? `http://localhost:${process.env.PORT ?? 3000}`
		: window.location.origin;

export const edenClient = treaty<API>(host).api;

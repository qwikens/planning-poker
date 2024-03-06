import { proxy } from "valtio";
import { devtools } from "valtio/utils";

import { Issue, RoomState } from "./hooks/useRealtime";

export const state = proxy<{
	issues: Record<string, Issue[]>;
	room: Record<string, RoomState>;
	issuesOpen: boolean;
}>({
	issues: {},
	room: {},
	issuesOpen: false,
});

devtools(state, {
	name: "state",
	enabled: process.env.NODE_ENV === "development",
});

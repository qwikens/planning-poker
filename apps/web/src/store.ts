import { proxy } from "valtio";
import { devtools } from "valtio/utils";

import { Issue, RoomState } from "./hooks/useRealtime";

interface GameState {
	issues: Record<string, Issue[]>;
	room: Record<string, RoomState>;
	issuesOpen: boolean;
}

export const state = proxy<GameState>({
	issues: {},
	room: {},
	issuesOpen: true,
});

devtools(state, {
	name: "state",
	enabled: process.env.NODE_ENV === "development",
});

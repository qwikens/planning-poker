import { proxy } from "valtio";
import { devtools } from "valtio/utils";

import { Issue, RoomState } from "./hooks/useRealtime";

interface GameState {
	issues: Record<string, Issue[]>;
	room: Record<string, RoomState>;
	issuesOpen: boolean;
	globalSequentialId: number;
	currentIndex: number;
}

export const state = proxy<GameState>({
	issues: {},
	room: {},
	issuesOpen: true,
	globalSequentialId: 1,
	currentIndex: 0,
});

devtools(state, {
	name: "state",
	enabled: process.env.NODE_ENV === "development",
});

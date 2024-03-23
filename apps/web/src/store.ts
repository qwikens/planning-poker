import { proxy } from "valtio";
import { devtools } from "valtio/utils";

import { Issue, RoomState, VotingHistory } from "./hooks/useRealtime";

type GameState = {
  issues: Record<string, Issue[]>;
  decryptedIssues: Issue[];
  votingHistory: Record<string, VotingHistory[]>;
  room: Record<string, RoomState>;
  issuesOpen: boolean;
  globalSequentialId: number;
  currentIndex: number;
};

export const state = proxy<GameState>({
  issues: {},
  decryptedIssues: [],
  room: {},
  issuesOpen: true,
  globalSequentialId: 1,
  currentIndex: 0,
  votingHistory: {},
});

devtools(state, {
  name: "state",
  enabled: process.env.NODE_ENV === "development",
});

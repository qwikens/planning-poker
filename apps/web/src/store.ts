import { proxy } from "valtio";
import { devtools } from "valtio/utils";

export type Issue = {
  id: string;
  storyPoints?: number;
  createdAt: number;
  createdBy: string;
  title: string;
};

type Vote = {
  votedBy: User;
  vote: number | string;
};

export type VotingHistory = {
  id?: string;
  votes: Vote[];
  issueTitle?: string;
  issueId?: string;
  agreement: number; // average of votes
  duration?: number; // start - end time in ms
};

export type User = {
  id: string;
  name: string;
};

export const participantsState = proxy<User[]>([]);
export const issuesState = proxy<Issue[]>([]);

export type GameState = {
  votes: Vote[];
  currentVotingIssue?: Issue;
  revealCards: boolean;
  votingSystem: string;
  name: string;
  counterStartedAt?: number;
  counterEndsAt?: number;
  currentCount?: number;
  createdBy: string;
  publicKeys: Record<string, string>;
  encryptedSymmetricKeys: Record<string, string>;
  hasDecryptedSymmetricKey: Record<string, boolean>;
  votingHistory: VotingHistory[];
  issuesOpen: boolean;
  globalSequentialId: number;
  currentIndex: number;
};

export const state = proxy<GameState>({
  votes: [],
  revealCards: false,
  votingSystem: "",
  name: "",
  createdBy: "",
  publicKeys: {},
  encryptedSymmetricKeys: {},
  hasDecryptedSymmetricKey: {},
  votingHistory: [],
  issuesOpen: true,
  globalSequentialId: 1,
  currentIndex: 0,
});

type DecryptedGameState = {
  decryptedIssues: Issue[];
};

export const decryptedState = proxy<DecryptedGameState>({
  decryptedIssues: [],
});

devtools(state, {
  name: "state",
  enabled: process.env.NODE_ENV === "development",
});

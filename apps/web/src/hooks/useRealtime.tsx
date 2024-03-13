import { createContext, useContext, useEffect, useMemo } from "react";
import { bind } from "valtio-yjs";
import * as Y from "yjs";

import { state } from "@/store";
import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import { useHocusPocus } from "./useHocuspocus";

type RealtimeProviderProps = {
	children: React.ReactNode;
};

export type Issue = {
	id: string;
	storyPoints?: number;
	createdAt: number;
	createdBy: string;
	link?: string;
	title: string;
};

export type VotingHistory = {
	id: string;
	votes: { votedBy: string; vote: number }[];
	issueName?: string;
	agreement: number; // average of votes
	duration: number; // start - end time in ms
};

export type RoomState = {
	votes: { votedBy: string; vote: number | string }[];
	currentVotingIssue?: Issue;
	participants: { name: string; id: string; online: boolean }[];
	revealCards: boolean;
	votingSystem: string;
	name: string;
	counterStartedAt?: number;
	counterEndsAt?: number;
	currentCount?: number;
};

type RealtimeContextType = {
	issues: Y.Map<Issue[]>;
	room: Y.Map<RoomState>;
	votingHistory: Y.Array<VotingHistory>;
	undoManagerIssues: Y.UndoManager;
};

const RealtimeContext = createContext<RealtimeContextType | undefined>(
	undefined,
);

export const useDocuments = () => {
	const context = useContext(RealtimeContext);
	if (!context) {
		throw new Error("useRealtime must be used within a RealtimeProvider");
	}
	return context;
};

export const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
	const { provider, roomId } = useHocusPocus();
	const room = provider.document.getMap<RoomState>(`ui-state${roomId}`);
	const issues = provider.document.getMap<Issue[]>(`issues-${roomId}`);
	const votingHistory = provider.document.getArray<VotingHistory>(
		`vote-history${roomId}`,
	);

	const undoManagerIssues = useMemo(() => new Y.UndoManager(issues), [issues]);

	useEffect(() => {
		const unbind = bind(state.issues, issues);
		const unbindUiState = bind(state.room, room);

		return () => {
			unbind();
			unbindUiState();
		};
	}, [issues, room]);

	const handleHotkey = (shortcut: string): HotkeyItem => {
		return [
			shortcut,
			(event: KeyboardEvent) => {
				event.preventDefault();
				undoManagerIssues.undo();

				if (process.env.NODE_ENV === "development") {
					console.log(`Shortcut executed: ${shortcut}`);
				}
			},
		];
	};

	useHotkeys(
		[
			handleHotkey("mod+z"),

			[
				"shift+mod+z",
				(event) => {
					event.preventDefault();
					undoManagerIssues.redo();
				},
			],
		],
		[],
	);

	return (
		<RealtimeContext.Provider
			value={{
				issues,
				room,
				undoManagerIssues,
				votingHistory,
			}}
		>
			{children}
		</RealtimeContext.Provider>
	);
};

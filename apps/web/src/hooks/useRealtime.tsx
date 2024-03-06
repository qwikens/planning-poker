import { createContext, useContext, useEffect } from "react";
import { bind } from "valtio-yjs";
import * as Y from "yjs";

import { state } from "@/store";
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
	canShow: boolean;
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

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({
	children,
}) => {
	const { provider, roomId, canShow } = useHocusPocus();
	const room = provider.document.getMap<RoomState>(`ui-state${roomId}`);
	const issues = provider.document.getMap<Issue[]>(`issues-${roomId}`);
	const votingHistory = provider.document.getArray<VotingHistory>(
		`vote-history${roomId}`,
	);

	useEffect(() => {
		const unbind = bind(state.issues, issues);
		const unbindUiState = bind(state.room, room);

		return () => {
			unbind();
			unbindUiState();
		};
	}, [issues, room]);

	return (
		<RealtimeContext.Provider
			value={{
				issues,
				room,
				votingHistory,
				canShow,
			}}
		>
			{children}
		</RealtimeContext.Provider>
	);
};

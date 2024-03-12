import { useDocuments } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

export const VoteNext = ({ roomId }: { roomId: string }) => {
	const snap = useSnapshot(state);
	const { room } = useDocuments();

	const onVoteNext = () => {
		const currentIssueId = snap.room[roomId]?.currentVotingIssue?.id;
		const currentIssues = snap.issues[roomId];

		if (!currentIssueId || !currentIssues) {
			return;
		}

		const nextIssue = currentIssues.find((issue) => issue.storyPoints === 0);

		if (nextIssue) {
			room.set(roomId, {
				...state.room[roomId],
				currentVotingIssue: nextIssue,
			});
		}
	};

	useHotkeys([["n", onVoteNext]]);

	return null;
};

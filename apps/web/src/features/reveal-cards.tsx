import { useDocuments } from "@/hooks/useRealtime.tsx";
import { update } from "@/lib/update.ts";
import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import mean from "lodash.mean";
import { useSnapshot } from "valtio";

export const RevealCards = ({ roomId }: { roomId: string }) => {
	const snap = useSnapshot(state);
	const { room, issues, votingHistory } = useDocuments();

	const onRevealCards = () => {
		if (snap.room[roomId].votes?.map((vote) => vote.vote).length === 0) return;

		const currentIssues = snap.issues[roomId];

		const index = currentIssues?.findIndex((issue) => {
			return issue.id === snap.room[roomId]?.currentVotingIssue?.id;
		});

		// add a new voting history here
		const storyPoints = mean(snap.room[roomId].votes?.map((vote) => vote.vote));

		if (index && index !== -1) {
			const updated = {
				...currentIssues[index],
				storyPoints,
			};

			const updatedIssues = update(index, updated, [...currentIssues]);

			if (index >= 0 && index < (issues.get(roomId)?.length ?? 0)) {
				issues.doc?.transact(() => {
					issues.set(roomId, updatedIssues);
				});
			}
		}

		votingHistory.set(roomId, [
			...(state?.votingHistory[roomId] ?? []),
			{
				id: snap.room[roomId].currentVotingIssue?.id,
				votes: [...snap.room[roomId].votes],
				issueName: snap.room[roomId].currentVotingIssue?.title,
				agreement: storyPoints,
			},
		]);

		room.set(roomId, {
			...state.room[roomId],
			revealCards: true,
		});
	};

	useHotkeys([["r", onRevealCards]]);

	return null;
};

import { ButtonRotateBorder } from "@/components/ui/button-rotate-border";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { issuesState, state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import mean from "lodash.mean";
import { useSnapshot } from "valtio";

export const RevealCards = () => {
  const snap = useSnapshot(state);
  const issuesSnap = useSnapshot(issuesState);
  const { room, issues } = useDocuments();

  const onRevealCards = () => {
    if (snap.votes?.map((vote) => vote.vote).length === 0) return;

    const currentIssues = issuesSnap;

    const index =
      currentIssues?.findIndex((issue) => {
        return issue.id === snap.currentVotingIssue?.id;
      }) ?? -1;

    if (index !== -1) {
      const numericVotes = snap.votes
        .filter((vote) => typeof vote.vote === "number")
        .map((vote) => Number(vote.vote));
      const averageStoryPoints = Math.round(mean(numericVotes));

      const updatedIssue = {
        ...currentIssues[index],
        storyPoints: averageStoryPoints,
      };

      if (index >= 0 && index < issues.length) {
        // TODO: update this when YJS has an update method
        // FIXME: run this in a transaction. Valtio is not reactive to this transaction, need to fix it
        issues.delete(index, 1);
        issues.insert(index, [updatedIssue]);
      }

      room.set("votingHistory", [
        ...snap.votingHistory,
        {
          id: snap.currentVotingIssue?.id,
          votes: [...snap.votes],
          issueTitle: snap.currentVotingIssue?.title,
          issueId: snap.currentVotingIssue?.id,
          agreement: averageStoryPoints,
        },
      ]);
    }

    room.set("revealCards", true);
  };

  useHotkeys([["r", onRevealCards]]);

  return (
    <ButtonRotateBorder onClick={onRevealCards}>
      Reveal cards
    </ButtonRotateBorder>
  );
};

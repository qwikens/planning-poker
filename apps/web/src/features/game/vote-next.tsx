import { ButtonRotateBorder } from "@/components/ui/button-rotate-border";
import { toast } from "@/components/ui/use-toast.ts";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

export const VoteNext = ({ roomId }: { roomId: string }) => {
  const snap = useSnapshot(state);
  const { room } = useDocuments();

  const onVoteNext = () => {
    const currentIssueId = snap.room[roomId]?.currentVotingIssue?.id;
    const currentIssues = snap.decryptedIssues;

    if (
      snap.room[roomId]?.votes.length > 0 &&
      !snap.room[roomId]?.revealCards
    ) {
      toast({
        title: "Can't move to the next issue, reveal the cards first",
      });
      return;
    }

    if (!currentIssueId || !currentIssues) {
      return;
    }

    const nextIssue = currentIssues.find((issue) => issue.storyPoints === 0);

    if (nextIssue) {
      room.set(roomId, {
        ...state.room[roomId],
        currentVotingIssue: nextIssue,
        revealCards: false,
        votes: [],
      });
      return;
    }

    toast({
      title: "No more issues to vote on",
    });
  };

  useHotkeys([["n", onVoteNext]]);

  return (
    <ButtonRotateBorder onClick={onVoteNext}>Vote next</ButtonRotateBorder>
  );
};

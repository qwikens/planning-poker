import { ButtonRotateBorder } from "@/components/ui/button-rotate-border";
import { toast } from "@/components/ui/use-toast.ts";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { decryptedState, state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

export const VoteNext = () => {
  const snap = useSnapshot(state);
  const { decryptedIssues } = useSnapshot(decryptedState);
  const { room } = useDocuments();

  const onVoteNext = () => {
    const currentIssueId = snap.currentVotingIssue?.id;

    if (snap.votes.length > 0 && !snap.revealCards) {
      toast({
        title: "Can't move to the next issue, reveal the cards first",
      });
      return;
    }

    if (!currentIssueId || !decryptedIssues) {
      return;
    }

    const nextIssue = decryptedIssues.find((issue) => issue.storyPoints === 0);

    if (nextIssue) {
      room.set("votes", []);
      room.set("revealCards", false);
      room.set("currentVotingIssue", nextIssue);
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

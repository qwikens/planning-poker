import { ButtonRotateBorder } from "@/components/ui/button-rotate-border";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

export const VoteAgain = () => {
  const snap = useSnapshot(state);
  const { room } = useDocuments();

  const onVoteAgain = () => {
    const isRevealed = snap.revealCards;

    if (isRevealed) {
      room.set("revealCards", false);
      room.set("votes", []);
    }
  };

  useHotkeys([["v", onVoteAgain]]);

  return (
    <ButtonRotateBorder onClick={onVoteAgain}>Vote again</ButtonRotateBorder>
  );
};

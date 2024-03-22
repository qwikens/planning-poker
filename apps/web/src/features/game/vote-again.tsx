import { ButtonRotateBorder } from "@/components/ui/button-rotate-border";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

export const VoteAgain = ({ roomId }: { roomId: string }) => {
  const snap = useSnapshot(state);
  const { room } = useDocuments();

  const onVoteAgain = () => {
    const isRevealed = snap.room[roomId]?.revealCards;

    if (isRevealed) {
      room.set(roomId, {
        ...state.room[roomId],
        revealCards: false,
        votes: [],
      });
    }
  };

  useHotkeys([["v", onVoteAgain]]);

  return (
    <ButtonRotateBorder onClick={onVoteAgain}>Vote again</ButtonRotateBorder>
  );
};

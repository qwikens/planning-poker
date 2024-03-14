import CardFlip from "@/components/ui/cardflip.tsx";
import { state } from "@/store.ts";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useSnapshot } from "valtio";

export const VotingResult = ({ id }: { id: string }) => {
  const snap = useSnapshot(state);

  const roomState = snap.room[id];

  const groupedVotes: Record<number | string, number> =
    roomState?.votes?.reduce<Record<number | string, number>>((acc, vote) => {
      acc[vote.vote] = (acc[vote.vote] || 0) + 1;
      return acc;
    }, {});

  return (
    <div className="flex flex-col w-full gap-2 mx-auto max-w-[800px]">
      <h1 className="text-scale-[18px]/[26px] h-20 self-center mt-[80px]">
        {roomState?.currentVotingIssue?.title ? (
          <span>{roomState?.currentVotingIssue?.title}</span>
        ) : null}
      </h1>
      <div className="flex w-full gap-2">
        <AnimatePresence mode="wait">
          <LayoutGroup>
            <div
              className={
                "flex gap-4 justify-center items-center flex-wrap w-full"
              }
            >
              {roomState.participants.map((participant) => {
                const participantVote = roomState.votes.find(
                  (vote) => vote.votedBy.id === participant.id,
                );

                const canShowVote = roomState.revealCards;

                return (
                  <motion.div
                    layoutId={participant.id}
                    key={participant.id}
                    className="flex flex-col items-center gap-2 will-change-transform"
                    exit={{ opacity: 0, scale: 0.5 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className={"p-4 rounded-lg"}>
                      {participantVote?.vote ? (
                        <CardFlip
                          value={participantVote?.vote}
                          canShowVote={canShowVote}
                        />
                      ) : (
                        <div className=" w-[75px] bg-secondary/20 h-[100px] border border-border border-dashed  rounded-[8px] " />
                      )}
                    </div>

                    <p>{participant.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>
        </AnimatePresence>
      </div>

      {roomState?.revealCards && (
        <div className="flex flex-col gap-2">
          {Object.entries(groupedVotes).map(([vote, count]) => (
            <p key={vote}>
              Vote: {vote}, Count: {count}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

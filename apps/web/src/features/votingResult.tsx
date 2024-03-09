import CardFlip from "@/components/ui/cardflip.tsx";
import { state } from "@/store.ts";
import { useSnapshot } from "valtio";

export const VotingResult = ({ id }: { id: string }) => {
	const snap = useSnapshot(state);

	if (!id) return <div>Room id is required</div>;

	const roomState = snap.room[id];

	const groupedVotes: Record<number | string, number> =
		roomState?.votes?.reduce<Record<number | string, number>>((acc, vote) => {
			acc[vote.vote] = (acc[vote.vote] || 0) + 1;
			return acc;
		}, {});

	return (
		<div className="flex flex-col items-center w-full gap-2 mx-auto">
			<h1 className="text-scale-[18px]/[26px] h-20">
				{roomState?.currentVotingIssue?.title ? (
					<span>Voting issue: {roomState?.currentVotingIssue?.title}</span>
				) : null}
			</h1>
			<div className="flex gap-2">
				{roomState.participants
					.filter((participant) => participant.online)
					.map((participant) => {
						const participantVote = roomState.votes.find(
							(vote) => vote.votedBy === participant.name,
						);

						const canShowVote = roomState.revealCards;

						return (
							<div
								key={participant.id}
								className="flex flex-col items-center gap-2"
							>
								<div className={"p-4 rounded-lg"}>
									{participantVote?.vote ? (
										<CardFlip
											value={participantVote?.vote}
											canShowVote={canShowVote}
										/>
									) : (
										<div className=" w-[150px] bg-secondary/20 h-[200px] border border-border border-dashed  rounded-[12px] " />
									)}
								</div>

								<p>{participant.name}</p>
							</div>
						);
					})}
			</div>

			{roomState?.revealCards && (
				<div className="flex flex-col gap-2 mt-20">
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

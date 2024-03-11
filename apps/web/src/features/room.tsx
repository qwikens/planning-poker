import { Status } from "@/App";
import { Issues } from "@/components/ui/Issues";
import { Button } from "@/components/ui/button";
import CardFlip from "@/components/ui/cardflip";
import { Deck } from "@/components/ui/deck";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { HocusPocusProvider } from "@/hooks/useHocuspocus";
import { RealtimeProvider, useDocuments } from "@/hooks/useRealtime";
import {
	createSession,
	getGuestName,
	getSession,
	saveGuestName,
} from "@/lib/session";
import { update } from "@/lib/update";
import { state } from "@/store";
import { ydoc } from "@/yjsDoc";
import { useClipboard, useHotkeys } from "@mantine/hooks";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import mean from "lodash.mean";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { z } from "zod";

const VotingResult = ({ id }: { id: string }) => {
	const snap = useSnapshot(state);

	if (!id) {
		return <div>Room id is required</div>;
	}

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
				<AnimatePresence mode="wait">
					{roomState.participants.map((participant) => {
						const participantVote = roomState.votes.find(
							(vote) => vote.votedBy === participant.id,
						);

						const canShowVote = roomState.revealCards;

						return (
							<motion.div
								key={participant.id}
								className="flex flex-col items-center gap-2"
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
										<div className=" w-[150px] bg-secondary/20 h-[200px] border border-border border-dashed  rounded-[12px] " />
									)}
								</div>

								<p>{participant.name}</p>
							</motion.div>
						);
					})}
				</AnimatePresence>
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

const CopyToClipboard = ({ url }: { url: string }) => {
	const { copy, copied } = useClipboard();

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<Button
						variant={"outline"}
						onClick={() => {
							copy(url);
						}}
					>
						<span className="sr-only">
							{copied ? "Copied to clipboard" : "Copy to clipboard"}
						</span>

						{copied ? (
							<svg
								width={16}
								height={16}
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Copied</title>

								<path
									d="M22 11.1V6.9C22 3.4 20.6 2 17.1 2h-4.2C9.4 2 8 3.4 8 6.9V8h3.1c3.5 0 4.9 1.4 4.9 4.9V16h1.1c3.5 0 4.9-1.4 4.9-4.9z"
									stroke="#fff"
								/>
								<path
									d="M16 17.1v-4.2C16 9.4 14.6 8 11.1 8H6.9C3.4 8 2 9.4 2 12.9v4.2C2 20.6 3.4 22 6.9 22h4.2c3.5 0 4.9-1.4 4.9-4.9z"
									stroke="#fff"
								/>
								<path d="M6.08 15l1.95 1.95 3.89-3.9" stroke="#fff" />
							</svg>
						) : (
							<svg
								width={16}
								height={16}
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Copy</title>

								<path
									d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9z"
									stroke="#fff"
								/>
								<path
									d="M22 6.9v4.2c0 3.5-1.4 4.9-4.9 4.9H16v-3.1C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2h4.2C20.6 2 22 3.4 22 6.9z"
									stroke="#fff"
								/>
							</svg>
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent sideOffset={10}>
					<p>Copy game link</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const RevealCards = ({ roomId }: { roomId: string }) => {
	const snap = useSnapshot(state);
	const { room, issues } = useDocuments();

	const onRevealCards = () => {
		if (snap.room[roomId].votes?.map((vote) => vote.vote).length === 0) return;

		const currentIssues = snap.issues[roomId];

		const index = currentIssues.findIndex((issue) => {
			return issue.id === snap.room[roomId].currentVotingIssue?.id;
		});

		if (index !== -1) {
			const updated = {
				...currentIssues[index],
				storyPoints:
					snap.room[roomId].votingSystem === "t-shirt"
						? 0
						: mean(snap.room[roomId].votes?.map((vote) => vote.vote)),
			};

			const updatedIssues = update(index, updated, [...currentIssues]);

			if (index >= 0 && index < (issues.get(roomId)?.length ?? 0)) {
				issues.doc?.transact(() => {
					issues.set(roomId, updatedIssues);
				});
			}
		}

		room.set(roomId, {
			...state.room[roomId],
			revealCards: true,
		});
	};

	useHotkeys([["r", onRevealCards]]);

	return null;
};

const VoteNext = ({ roomId }: { roomId: string }) => {
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

const CreateUserSchema = z.object({
	userName: z.string().trim().min(1),
});

const CreateUserForm = ({ roomId }: { roomId: string }) => {
	const navigate = useNavigate();

	const { room } = useDocuments();

	const onCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const userName = formData.get("userName");

		try {
			const data = CreateUserSchema.parse({
				userName,
			});

			const user = {
				id: getSession() ?? createSession(),
				name: data.userName,
				online: true,
			};
			saveGuestName(data.userName);

			room.set(roomId, {
				...state.room[roomId],
				participants: [...(state.room[roomId]?.participants ?? []), user],
			});

			navigate(`/${roomId}`);
		} catch (error) {
			return;
		}
	};

	return (
		<form
			onSubmit={onCreateUser}
			className="max-w-[430px] w-full mx-auto px-4 py-2 "
		>
			<div className="flex flex-col justify-between h-full gap-2">
				<Input
					type="text"
					placeholder="User Name"
					name="userName"
					defaultValue={getGuestName() ?? ""}
				/>
				<Button type="submit">Create</Button>
			</div>
		</form>
	);
};

const Room: FC<{ roomId: string }> = ({ roomId }) => {
	const snapRoom = useSnapshot(state);
	const { room } = useDocuments();
	const userId = getSession();
	const userName = getGuestName();

	if (!ydoc.getMap(`ui-state${roomId}`).get(roomId) || !snapRoom.room[roomId]) {
		// needs sync
		return <div />;
	}

	const isInParticipants = snapRoom.room[roomId]?.participants?.some(
		(participant) => participant.id === getSession(),
	);

	if (!isInParticipants && (!userId || !userName)) {
		return (
			<div>
				<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
					<Status id={roomId} />
				</nav>
				<CreateUserForm roomId={roomId} />
			</div>
		);
	}

	if (!isInParticipants && userId && userName) {
		const user = {
			id: userId,
			name: userName,
			online: true,
		};

		room.set(roomId, {
			...state.room[roomId],
			participants: [...(state.room[roomId]?.participants ?? []), user],
		});
	}

	const url = `${window.location.origin}/${roomId}`;

	return (
		<div className="flex flex-col min-h-[100dvh] gap-4">
			<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
				<Status id={roomId} />
				<div className="flex items-center gap-2">
					<Modal />
					<CopyToClipboard url={url} />
					<Issues />
				</div>
			</nav>

			<div className="flex flex-1">
				<div className="relative flex flex-col flex-1 gap-2 p-4 mx-4 mb-4 overflow-hidden border rounded-lg shrink-0 bg-secondary/40 border-border">
					<VotingResult id={roomId} />
					<VoteNext roomId={roomId} />
					<RevealCards roomId={roomId} />
					<motion.div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
						<Deck roomId={roomId} />
					</motion.div>
				</div>
				<motion.div className="hidden flex-col items-center gap-4 xl:flex flex-auto max-w-[420px] w-full duration-150 ease-in-out mt-20">
					<QRCodeSVG
						value={url}
						className="hidden md:block mx-auto  w-[200px] h-[200px] "
					/>
					<p>Invite your friends to join the game</p>
				</motion.div>
			</div>
		</div>
	);
};

export const Component = () => {
	const roomId = useParams().id;

	// TODO: move this to "loader" and add default error page
	if (!roomId) {
		return <div>Room id is required</div>;
	}

	return (
		<HocusPocusProvider roomId={roomId} ydoc={ydoc}>
			<RealtimeProvider>
				<Room roomId={roomId} />
			</RealtimeProvider>
		</HocusPocusProvider>
	);
};
Component.displayName = "Room";

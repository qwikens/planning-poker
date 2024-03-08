import { useClipboard, useHotkeys } from "@mantine/hooks";
import { motion } from "framer-motion";
import mean from "lodash.mean";
import { nanoid } from "nanoid";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { z } from "zod";

import { Issues } from "@/components/ui/Issues";
import { PokerPlanningSelect } from "@/components/ui/PokerPlanningDropdown";
import { Button } from "@/components/ui/button";
import CardFlip from "@/components/ui/cardflip";
import { Dock } from "@/components/ui/deck";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NetworkStatus } from "@/components/ui/network-status";
import { TextAnimatedGradient } from "@/components/ui/text-animated";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HocusPocusProvider, useHocusPocus } from "@/hooks/useHocuspocus";
import { RealtimeProvider, useDocuments } from "@/hooks/useRealtime";
import { update } from "@/lib/update";
import { state } from "@/store";
import { ydoc } from "./yjsDoc";

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

const Status = ({ id }: { id: string }) => {
	const { room } = useSnapshot(state);

	const currentRoom = room[id];

	return (
		<div className="flex items-center gap-4">
			<div className="relative flex items-center">
				<svg
					width={24}
					height={26}
					viewBox="0 0 24 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Logo</title>

					<path
						d="M24 26h-5.806c-2.05-2.146-5.85-6.456-5.85-6.456a7.29 7.29 0 004.056-1.846 7.783 7.783 0 002.555-5.801c0-2.15-.89-4.234-2.426-5.683-2.31-2.18-6.114-2.635-8.797-.935-2.196 1.39-3.526 3.988-3.55 6.63a7.823 7.823 0 002.101 5.415A7.169 7.169 0 0010.37 19.5l3.779 3.98c-.848.205-1.73.314-2.638.314C5.26 23.796.023 18.415 0 11.951-.023 5.472 5.212 0 11.512 0c6.357 0 11.51 5.327 11.51 11.897 0 3.489-1.453 6.63-3.77 8.806L24 26z"
						fill="#fff"
					/>
					<defs>
						<clipPath id="clip0_82_11">
							<path fill="#fff" d="M0 0H24V26H0z" />
						</clipPath>
					</defs>
				</svg>

				<NetworkStatus />
			</div>

			<TextAnimatedGradient>{currentRoom?.name}</TextAnimatedGradient>
		</div>
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

export const Room = () => {
	const id = useParams().id;
	const snapRoom = useSnapshot(state);

	if (!id) {
		return <div>Room id is required</div>;
	}

	if (!ydoc.getMap(`ui-state${id}`).get(id) || !snapRoom.room[id]) {
		// needs sync
		return (
			<HocusPocusProvider roomId={id} ydoc={ydoc}>
				<RealtimeProvider>
					<div />
				</RealtimeProvider>
			</HocusPocusProvider>
		);
	}

	const isInParticipants = snapRoom.room[id]?.participants?.some(
		(participant) => participant.name === localStorage.getItem("guestUser"),
	);

	if (!isInParticipants) {
		return (
			<div>
				<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
					<Status id={id} />
				</nav>
				<HocusPocusProvider roomId={id} ydoc={ydoc}>
					<RealtimeProvider>
						<CreateUserForm roomId={id} />
					</RealtimeProvider>
				</HocusPocusProvider>
			</div>
		);
	}

	const url = `${window.location.origin}/${id}`;

	return (
		<HocusPocusProvider roomId={id} ydoc={ydoc}>
			<RealtimeProvider>
				<div className="flex flex-col min-h-[100dvh] gap-4">
					<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
						<Status id={id} />
						<div className="flex items-center gap-2">
							<Modal />
							<CopyToClipboard url={url} />
							<Issues />
						</div>
					</nav>

					<div className="flex flex-1">
						<div className="relative flex flex-col flex-1 gap-2 p-4 mx-4 mb-4 overflow-hidden border rounded-lg shrink-0 bg-secondary/40 border-border">
							<VotingResult id={id} />
							<VoteNext roomId={id} />
							<RevealCards roomId={id} />
							<motion.div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
								<Dock roomId={id} />
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
			</RealtimeProvider>
		</HocusPocusProvider>
	);
};

const CreateUserSchema = z.object({
	userName: z.string().trim().min(1),
});

const CreateUserForm = ({ roomId }: { roomId: string }) => {
	const navigate = useNavigate();
	const { clientId } = useHocusPocus();

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
				id: String(clientId),
				name: data.userName,
				online: true,
			};

			room.set(roomId, {
				...state.room[roomId],
				participants: [...(state.room[roomId]?.participants ?? []), user],
			});

			localStorage.setItem("guestUser", data.userName);

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
					defaultValue={localStorage.getItem("guestUser") ?? ""}
				/>
				<Button type="submit">Create</Button>
			</div>
		</form>
	);
};

const CreateRoomSchema = z.object({
	roomName: z.string().default("Planning Poker Game"),
	userName: z.string().min(1),
	votingSystem: z.enum(["t-shirt", "fibonacci"]),
});

export const CreateRoomForm = () => {
	const navigate = useNavigate();
	const { copy } = useClipboard();

	const onCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const roomName = formData.get("roomName");
		const userName = formData.get("userName");
		const votingSystem = formData.get("votingSystem");
		const roomId = nanoid(7);
		const room = ydoc.getMap(`ui-state${roomId}`);

		try {
			const data = CreateRoomSchema.parse({
				roomName,
				userName,
				votingSystem,
			});

			const user = {
				id: nanoid(),
				name: data.userName,
				online: true,
			};

			const game = {
				id: roomId,
				createdAt: Date.now(),
				createdBy: data.userName,
				name: data.roomName.length > 0 ? data.roomName : "Planning Poker Game",
				votingSystem: data.votingSystem,
				participants: [user],
				revealCards: false,
				votes: [],
			};

			room.set(roomId, game);
			localStorage.setItem("guestUser", data.userName);
			state.room[roomId] = game;

			const roomUrl = `${window.location.origin}/${roomId}`;
			copy(roomUrl);

			navigate(`/${roomId}`);
		} catch (error) {
			return;
		}
	};
	const currentUser = localStorage.getItem("guestUser") ?? "";
	return (
		<div>
			<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
				<svg
					width={16}
					height={16}
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Logo</title>

					<path
						d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11z"
						stroke="#fff"
					/>
					<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#fff" />
				</svg>
			</nav>
			<form
				onSubmit={onCreateRoom}
				className="max-w-[430px] w-full mx-auto px-4 py-2 mt-20"
			>
				<div className="flex flex-col justify-between h-full gap-2">
					<div className="flex flex-col gap-4">
						<div>Create Room</div>
						<Input
							type="text"
							placeholder="Room Name"
							name="roomName"
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus
						/>
						<Input
							type="text"
							placeholder="User Name"
							name="userName"
							defaultValue={currentUser}
						/>
						<PokerPlanningSelect />
					</div>
					<Button type="submit" className="mt-4">
						Create
					</Button>
				</div>
			</form>
		</div>
	);
};

export const App = () => {
	const navigate = useNavigate();
	const createRoom = () => navigate("/new-game");

	return (
		<div>
			<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
				<Status id={""} />
			</nav>

			<div className="flex flex-col max-w-[430px] w-full mt-10 gap-4 px-4 mx-auto">
				<Button onClick={createRoom}>Start new game</Button>
			</div>
		</div>
	);
};

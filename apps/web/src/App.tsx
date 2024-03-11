import { useClipboard } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { z } from "zod";

import { PokerPlanningSelect } from "@/components/ui/PokerPlanningDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkStatus } from "@/components/ui/network-status";
import { TextAnimatedGradient } from "@/components/ui/text-animated";
import { state } from "@/store";
import {
	createRoom,
	createSession,
	getGuestName,
	getSession,
	saveGuestName,
} from "./lib/session";
import { ydoc } from "./yjsDoc";

export const Status = ({ id }: { id: string }) => {
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

const createRoomSchema = z.object({
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
		const roomId = createRoom();
		const room = ydoc.getMap(`ui-state${roomId}`);

		try {
			const data = createRoomSchema.parse({
				roomName,
				userName,
				votingSystem,
			});

			const user = {
				id: getSession() ?? createSession(),
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
			saveGuestName(data.userName);
			state.room[roomId] = game;

			const roomUrl = `${window.location.origin}/${roomId}`;
			copy(roomUrl);

			navigate(`/${roomId}`);
		} catch (error) {
			return;
		}
	};
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
							autoFocus
						/>
						<Input
							type="text"
							placeholder="User Name"
							name="userName"
							defaultValue={getGuestName() ?? ""}
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

import { PokerPlanningSelect } from "@/components/ui/PokerPlanningDropdown.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { state } from "@/store.ts";
import { ydoc } from "@/yjsDoc.ts";
import { useClipboard } from "@mantine/hooks";
import { nanoid } from "nanoid";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const CreateGameSchema = z.object({
	gameName: z.string().default("Planning Poker Game"),
	userName: z.string().min(1),
	votingSystem: z.enum(["fibonacci"]),
});

export const CreateRoomForm = () => {
	const navigate = useNavigate();
	const { copy } = useClipboard();

	const onCreateGame = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const gameName = formData.get("gameName");
		const userName = formData.get("userName");
		const votingSystem = formData.get("votingSystem");
		const roomId = nanoid(7);
		const room = ydoc.getMap(`ui-state${roomId}`);

		try {
			const data = CreateGameSchema.parse({
				gameName,
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
				name: data.gameName.length > 0 ? data.gameName : "Planning Poker Game",
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
			<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]" />
			<form
				onSubmit={onCreateGame}
				className="max-w-[430px] w-full mx-auto px-4 py-2 mt-20"
			>
				<div className="flex flex-col justify-between h-full gap-2">
					<div className="flex flex-col gap-4">
						<div>Create Game</div>
						<Input
							type="text"
							placeholder="Game Name"
							name="gameName"
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

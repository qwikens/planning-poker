import { useMediaQuery } from "@mantine/hooks";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { z } from "zod";

import { useDocuments } from "@/hooks/useRealtime";
import { cn } from "@/lib/utils";
import { state } from "@/store";

import { PokerPlanningSelect } from "@/components/ui/PokerPlanningDropdown";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";

export function Modal() {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const closeModal = () => {
		setOpen(false);
	};

	const { title, description } = {
		title: "Game settings",
		description: "Update the game settings",
	};

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" className="">
						<span className="sr-only">{title}</span>
						<svg
							width={16}
							height={16}
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Settings</title>

							<path
								d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11z"
								stroke="#fff"
							/>
							<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#fff" />
						</svg>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<ProfileForm closeModal={closeModal} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline">
					<span className="sr-only">{title}</span>

					<svg
						aria-label="Open game settings"
						width={16}
						height={16}
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Settings</title>

						<path
							d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11z"
							stroke="#fff"
						/>
						<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#fff" />
					</svg>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<ProfileForm className="px-4" closeModal={closeModal} />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

const UpdateRoomSchema = z
	.object({
		roomName: z.string().default("Planning Poker Game"),
		votingSystem: z.string(),
	})
	.transform((value) => ({
		...value,
		roomName:
			value.roomName.length > 0 ? value.roomName : "Planning Poker Game",
	}));

function ProfileForm({
	className,
	closeModal,
}: React.ComponentProps<"form"> & {
	closeModal: VoidFunction;
}) {
	const snap = useSnapshot(state);
	const roomId = useParams().id;
	const { room } = useDocuments();

	if (!roomId) {
		return <div>Room id is required</div>;
	}

	const currentRoom = snap.room[roomId];

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const name = formData.get("name");
		const votingSystem = formData.get("votingSystem");

		try {
			const data = UpdateRoomSchema.parse({
				roomName: name,
				votingSystem,
			});

			room.set(roomId, {
				...state.room[roomId],
				name: data.roomName,
				votingSystem: data.votingSystem,
			});
		} catch (error) {
			return;
		}

		closeModal();
	};
	return (
		<form
			className={cn("grid items-start gap-4", className)}
			onSubmit={onSubmit}
		>
			<div className="grid gap-2">
				<Label htmlFor="email">Game's name</Label>
				<Input type="text" name="name" defaultValue={currentRoom.name} />
			</div>

			<div className="grid gap-2">
				<Label htmlFor="votingSystem">Voting System</Label>

				<PokerPlanningSelect defaultValue={currentRoom.votingSystem} />
			</div>

			<Button type="submit">Save changes</Button>
		</form>
	);
}

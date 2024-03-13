import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import {
	AnimatePresence,
	MotionValue,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useSnapshot } from "valtio";

import { getSession } from "@/lib/session";
import { useDocuments } from "../../hooks/useRealtime";
import { cn } from "../../lib/utils";
import { state } from "../../store";

export function Deck({ roomId }: { roomId: string }) {
	const mouseX = useMotionValue(Infinity);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const snap = useSnapshot(state);

	useHotkeys([
		["1", () => onVote(1)],
		["2", () => onVote(2)],
		["3", () => onVote(3)],
		["4", () => onVote(5)],
		["5", () => onVote(8)],
		["6", () => onVote(13)],
		["7", () => onVote(21)],
		["8", () => onVote(34)],
		["9", () => onVote("☕")],
		["0", () => onVote("?")],
	]);

	if (isMobile) {
		return null;
	}
	// TODO: need to be based on the voting system
	const optionsList: Record<string, number[] | string[]> = {
		"t-shirt": ["S", "M", "L", "XL", "XXL", "?", "☕"],
		fibonacci: [1, 2, 3, 5, 8, 13, 21, 34],
	};

	const options =
		optionsList[snap.room[roomId]?.votingSystem] ?? optionsList.fibonacci;

	const { room } = useDocuments();

	const onVote = (option: number | string) => {
		const userId = getSession();
		const user = snap.room[roomId]?.participants?.find(
			(participant) => participant.id === userId,
		);

		if (!user) return;

		const existingVotesWithoutMine =
			room.get(roomId)?.votes?.filter((vote) => vote.votedBy.id !== user.id) ??
			[];

		room.set(roomId, {
			...state.room[roomId],
			revealCards: false,
			votes: [
				...existingVotesWithoutMine,
				{
					votedBy: user,
					vote: option,
				},
			],
		});
	};

	const activeTab = snap.room[roomId]?.votes?.find(
		(vote) => vote.votedBy.id === getSession(),
	);

	return (
		<AnimatePresence>
			<motion.div
				initial={{ y: snap.room[roomId]?.revealCards ? 100 : 0 }}
				animate={{
					y: snap.room[roomId]?.revealCards ? 100 : 0,
				}}
				onMouseMove={(e) => mouseX.set(e.pageX)}
				onMouseLeave={() => mouseX.set(Infinity)}
				className="flex items-end h-16 gap-4 px-4 pb-3 mx-auto border rounded-2xl border-border bg-secondary"
			>
				{options.map((option) => {
					return (
						<AppIcon
							mouseX={mouseX}
							key={option}
							isVisible={snap.room[roomId]?.revealCards}
							onClick={() => onVote(option)}
							className={cn("relative min-w-[40px] h-[40px]", {
								"cursor-pointer": !snap.room[roomId]?.revealCards,
								"border-primary/90": activeTab?.vote === option,
							})}
						>
							{option}

							{activeTab?.vote === option && (
								<motion.span
									layoutId="bubble"
									className="absolute inset-0 z-10 bg-primary/30"
									style={{ borderRadius: 9999 }}
									transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
								/>
							)}
						</AppIcon>
					);
				})}
			</motion.div>
		</AnimatePresence>
	);
}

function AppIcon({
	mouseX,
	className,
	onClick,
	children,
	isVisible,
}: {
	mouseX: MotionValue;
	className?: string;
	onClick: () => void;
	children: React.ReactNode;
	isVisible: boolean;
}) {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const ref = useRef<HTMLButtonElement>(null);

	const distance = useTransform(mouseX, (val) => {
		const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

		return val - bounds.x - bounds.width / 2;
	});

	const sizes = isMobile ? [40, 60, 40] : [60, 100, 60];

	const widthSync = useTransform(distance, [-150, 0, 150], sizes);
	const width = useSpring(widthSync, {
		mass: 0.1,
		stiffness: 150,
		damping: 12,
	});

	return (
		<motion.button
			onClick={onClick}
			tabIndex={isVisible ? -1 : 0}
			ref={ref}
			whileTap={{ scale: 0.95 }}
			style={{ width, height: width, willChange: "width scale" }}
			className={cn(
				"w-10 bg-secondary border-primary/50 border rounded-full aspect-square transition-background",
				className,
			)}
		>
			{children}
		</motion.button>
	);
}

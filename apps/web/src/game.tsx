import { Issues } from "@/components/ui/Issues.tsx";
import { Dock } from "@/components/ui/deck";
import { GameSettingsModal } from "@/components/ui/modal";
import { Toaster } from "@/components/ui/toaster";
import { CopyToClipboard } from "@/features/copy-to-clipboard";
import { CreateUserForm } from "@/features/create-user-form";
import { RevealCards } from "@/features/reveal-cards";
import { VoteNext } from "@/features/vote-next.tsx";
import { VotingResult } from "@/features/voting-result.tsx";
import { HocusPocusProvider } from "@/hooks/useHocuspocus.tsx";
import { RealtimeProvider } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { ydoc } from "@/yjsDoc.ts";
import { useDocumentTitle } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { HeaderLeft } from "./components/header-left";
import { QRCodeSVG } from "qrcode.react";

export const Game = () => {
	const id = useParams().id;
	const snapRoom = useSnapshot(state);
	const currentIssue = id ? snapRoom.room[id]?.currentVotingIssue : undefined;
	const title = currentIssue
		? `Voting ${currentIssue.title}`
		: "Planning Poker";

	useDocumentTitle(title);

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
					<HeaderLeft id={id} />
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
				<div className="flex flex-col min-h-[100dvh]">
					<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
						<HeaderLeft id={id} />

						<div className="flex items-center gap-2">
							<GameSettingsModal />
							<CopyToClipboard url={url} />
							<Issues />
						</div>
					</nav>

					<div className={"flex flex-1"}>
						<div className={"min-h-full flex-1"}>
							<div className="relative flex flex-col h-full gap-2 p-4 mx-4 mb-4 overflow-hidden rounded-lg border-border">
								<VotingResult id={id} />
								<VoteNext roomId={id} />
								<RevealCards roomId={id} />
								<div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
									<Dock roomId={id} />
								</div>
							</div>
						</div>

						<div className="hidden flex-col items-center gap-4 xl:flex flex-auto max-w-[372px] w-full duration-150 ease-in-out mt-20 min-w-[350px]">
							<QRCodeSVG
								value={url}
								className="hidden md:block mx-auto  w-[200px] h-[200px] qr-code"
							/>
						</div>
					</div>
				</div>
			</RealtimeProvider>
			<Toaster />
		</HocusPocusProvider>
	);
};

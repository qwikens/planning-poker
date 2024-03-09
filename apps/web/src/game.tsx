import { HeaderLeft } from "@/components/headerLeft.tsx";
import { Issues } from "@/components/ui/Issues.tsx";
import { Dock } from "@/components/ui/deck.tsx";
import { Modal } from "@/components/ui/modal.tsx";
import { CopyToClipboard } from "@/features/CopyToClipboard.tsx";
import { CreateUserForm } from "@/features/CreateUserForm.tsx";
import { RevealCards } from "@/features/RevealCards.tsx";
import { VoteNext } from "@/features/VoteNext.tsx";
import { VotingResult } from "@/features/votingResult.tsx";
import { HocusPocusProvider } from "@/hooks/useHocuspocus.tsx";
import { RealtimeProvider } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { ydoc } from "@/yjsDoc.ts";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

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

	// needs to be updated to use their ID not just the name
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
				<div className="flex flex-col min-h-[100dvh] gap-4">
					<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
						<HeaderLeft id={id} />
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
							<div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
								<Dock roomId={id} />
							</div>
						</div>

						<div className="hidden flex-col items-center gap-4 xl:flex flex-auto max-w-[420px] w-full duration-150 ease-in-out mt-20">
							<QRCodeSVG
								value={url}
								className="hidden md:block mx-auto  w-[200px] h-[200px] "
							/>
							<p>Invite your friends to join the game</p>
						</div>
					</div>
				</div>
			</RealtimeProvider>
		</HocusPocusProvider>
	);
};

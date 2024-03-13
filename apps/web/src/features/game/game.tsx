import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { GameSettingsModal } from "@/components/ui/modal";
import { Toaster } from "@/components/ui/toaster";
import { Issues } from "@/features/game/Issues";
import { CreateUserForm } from "@/features/game/create-user-form";
import { Deck } from "@/features/game/deck";
import { RevealCards } from "@/features/game/reveal-cards";
import { VoteNext } from "@/features/game/vote-next.tsx";
import { VotingResult } from "@/features/game/voting-result.tsx";
import { HocusPocusProvider } from "@/hooks/useHocuspocus.tsx";
import { RealtimeProvider, useDocuments } from "@/hooks/useRealtime.tsx";
import { getGuestName, getSession } from "@/lib/session";
import { state } from "@/store.ts";
import { ydoc } from "@/yjsDoc.ts";
import { useDocumentTitle } from "@mantine/hooks";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { HeaderLeft } from "../../components/header-left";

const Game: FC<{ roomId: string }> = ({ roomId }) => {
  const snapRoom = useSnapshot(state);
  const { room } = useDocuments();
  const userId = getSession();
  const userName = getGuestName();
  const currentIssue = roomId
    ? snapRoom.room[roomId]?.currentVotingIssue
    : undefined;
  const title = currentIssue
    ? `Voting ${currentIssue.title}`
    : "Planning Poker";

  useDocumentTitle(title);

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
          <HeaderLeft id={roomId} />
        </nav>

        <CreateUserForm roomId={roomId} />
      </div>
    );
  }

  if (!isInParticipants && userId && userName) {
    const user = {
      id: userId,
      name: userName,
    };

    room.set(roomId, {
      ...state.room[roomId],
      participants: [...(state.room[roomId]?.participants ?? []), user],
    });
  }

  const url = `${window.location.origin}/${roomId}`;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
        <HeaderLeft id={roomId} />

        <div className="flex items-center gap-2">
          <GameSettingsModal />
          <CopyToClipboard url={url} />
          <Issues />
        </div>
      </nav>

      <div className={"flex flex-1"}>
        <div className={"min-h-full flex-1"}>
          <div className="relative flex flex-col h-full gap-2 p-4 mx-4 mb-4 overflow-hidden rounded-lg border-border">
            <VotingResult id={roomId} />
            <VoteNext roomId={roomId} />
            <RevealCards roomId={roomId} />
            <div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
              <Deck roomId={roomId} />
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
  );
};

export const Component = () => {
  const roomId = useParams().id;

  if (!roomId) {
    return <div>Room id is required</div>;
  }

  return (
    <HocusPocusProvider roomId={roomId} ydoc={ydoc}>
      <RealtimeProvider>
        <Game roomId={roomId} />
      </RealtimeProvider>
      <Toaster />
    </HocusPocusProvider>
  );
};
Component.displayName = "Game";
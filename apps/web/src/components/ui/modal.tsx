import { useMediaQuery } from "@mantine/hooks";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { z } from "zod";

import { useDocuments } from "@/hooks/useRealtime";
import { cn } from "@/lib/utils";
import { state } from "@/store";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PokerPlanningSelect } from "@/components/ui/poker-planning-dropdown.tsx";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";

export function GameSettingsModal({
  closeModal,
}: {
  closeModal: VoidFunction;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { title, description } = {
    title: "Game settings",
    description: "Update the game settings",
  };

  if (isDesktop) {
    return (
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={() => {
          document.getElementById("game-settings")?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ProfileForm closeModal={closeModal} />
      </DialogContent>
    );
  }

  return (
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
  );
}

const updateRoomSchema = z
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
      const data = updateRoomSchema.parse({
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

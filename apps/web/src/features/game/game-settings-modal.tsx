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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VotingSystemSelect } from "@/components/ui/voting-system-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";

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

const updateGameSchema = z.object({
  gameName: z.string().min(1),
  votingSystem: z.string(),
});
type UpdateGameFormInput = z.input<typeof updateGameSchema>;
type UpdateGameFormValues = z.infer<typeof updateGameSchema>;

function ProfileForm({
  className,
  closeModal,
}: React.ComponentProps<"form"> & {
  closeModal: VoidFunction;
}) {
  const snap = useSnapshot(state);
  const roomId = useParams().id;
  const { room } = useDocuments();
  const form = useForm<UpdateGameFormInput, unknown, UpdateGameFormValues>({
    resolver: zodResolver(updateGameSchema),
    defaultValues: {
      gameName: snap.name,
      votingSystem: snap.votingSystem,
    },
  });

  if (!roomId) {
    return <div>Room id is required</div>;
  }

  const onUpdateGame = (values: UpdateGameFormValues) => {
    const { gameName, votingSystem } = values;

    room.set("name", gameName);
    room.set("votingSystem", votingSystem);

    closeModal();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onUpdateGame)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="gameName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="votingSystem"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <VotingSystemSelect field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}

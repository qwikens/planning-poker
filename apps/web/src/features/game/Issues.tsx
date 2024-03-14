import { getHotkeyHandler, useFocusWithin, useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

import { z } from "zod";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Issue, RoomState, useDocuments } from "@/hooks/useRealtime";
import { state } from "@/store";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { IssueDropdownMenu } from "@/components/ui/dropdown.tsx";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import useVimNavigation from "@/hooks/useVimNavigation";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils.ts";
import * as React from "react";

const issueSchema = z.object({
  title: z.string().min(1),
});

const CreateIssueForm = () => {
  const { issues } = useDocuments();
  const id = useParams().id;
  const inputRef = useRef<HTMLInputElement>(null);
  useHotkeys([
    [
      "c",
      () => {
        if (inputRef.current) inputRef.current.focus();
      },
    ],
  ]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const userId = getSession();
    if (!userId) return;

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");

    try {
      const data = issueSchema.parse({
        title,
      });
      if (id) {
        issues.set(id, [
          ...(issues.get(id) ?? []),
          {
            id: Date.now().toString(),
            storyPoints: 0,
            createdAt: Date.now(),
            createdBy: userId,
            title: data.title,
          },
        ]);
      }

      // reset the form
      event.currentTarget.reset();

      inputRef.current?.focus();
    } catch (error) {
      inputRef.current?.focus();
      return;
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Issue title"
        name="title"
        data-testid="create-issue-input"
        ref={inputRef}
      />
    </form>
  );
};

function IssueCard(props: {
  roomState: RoomState;
  issue: Issue;
  "data-vim-position": number;
  onClick: () => void;
  onDelete: () => void;
  onDeleteAll: () => void;
}) {
  const { ref, focused } = useFocusWithin();

  useHotkeys([
    ["Enter", focused ? props.onClick : () => {}, { preventDefault: false }],
  ]);

  const currentVoting =
    props.roomState?.currentVotingIssue?.id === props.issue.id;

  return (
    <motion.div
      data-vim-position={props["data-vim-position"]}
      onClick={props.onClick}
      tabIndex={0}
      ref={ref}
      style={{ overflow: "hidden" }}
      className={cn(
        "flex ring-offset-background mx-1 focus-visible:outline-none focus-visible:ring-ring/50   focus-visible:ring-offset-2 focus-visible:ring-1 flex-col  px-3 py-2 mt-2 bg-secondary/40 border rounded-md border-border transition-background ",
        {
          "bg-primary/20": currentVoting,
          "border-primary/50": currentVoting,
        },
      )}
    >
      <div className={"flex justify-between items-center"}>
        <p className={"text-sm"}>{props.issue.title}</p>
        <IssueDropdownMenu
          issue={props.issue}
          onDelete={props.onDelete}
          onCardClick={props.onClick}
          cardFocused={focused}
          index={props["data-vim-position"]}
        />
      </div>

      <div />

      <div className="flex items-center justify-between gap-2 mt-2">
        <span className="flex items-center gap-2 text-sm">
          {props.issue.storyPoints || "-"}
        </span>
      </div>
    </motion.div>
  );
}

const IssueList = () => {
  const snap = useSnapshot(state);
  const id = useParams().id;
  const { room, issues } = useDocuments();
  const { toast } = useToast();

  if (!id) {
    return <div>Room id is required</div>;
  }

  if (!room.get(id)) {
    return null;
  }

  const setActiveIssue = (issue: Issue) => {
    room.set(id, {
      ...state.room[id],
      revealCards: false,
      votes: [],
      currentVotingIssue: issue,
    });
  };

  const roomState = snap.room[id];

  const roomIssues = snap.issues[id] ?? [];

  const documentIssues = issues.get(id) ?? [];

  const onDelete = (issueId: string) => {
    const deletingIssue = documentIssues.find((issue) => issue.id === issueId);
    if (!deletingIssue) return;

    if (issueId === roomState.currentVotingIssue?.id) {
      toast({
        title: "Can't delete an issue that is currently being voted on",
      });
      return;
    }

    if (deletingIssue.createdBy !== getSession()) {
      toast({
        title: "Can't delete an issue you didn't create",
      });
      return;
    }

    const updatedIssues = documentIssues.filter(
      (issue) => issue.id !== issueId,
    );

    issues.set(id, updatedIssues);
  };

  const onDeleteAll = () => {
    if (roomState.createdBy !== getSession()) {
      toast({
        title:
          "Can't delete all issues, only the creator of the room can do that",
      });
      return;
    }

    room.set(id, {
      ...state.room[id],
      revealCards: false,
      votes: [],
      currentVotingIssue: undefined,
    });

    issues.set(id, []);

    const input = document.querySelector(
      "[data-testid=create-issue-input]",
    ) as HTMLInputElement;

    if (input) {
      input.focus();
    }
  };
  const [deleteOpen, setDeleteOpen] = useState(false);

  useHotkeys([["mod+Shift+Backspace", () => setDeleteOpen(true)]]);

  if (!roomState) {
    return null;
  }

  return (
    <ScrollArea className="h-[85dvh] rounded-md pb-10 px-4">
      <AnimatePresence initial={false}>
        {roomIssues
          .slice()
          .reverse()
          .map((issue, index) => (
            <IssueCard
              key={issue.id}
              data-vim-position={index}
              onDelete={() => {
                onDelete(issue.id);
              }}
              onDeleteAll={onDeleteAll}
              roomState={roomState as RoomState}
              issue={issue}
              onClick={() => {
                if (roomState.votes.length > 0 && !roomState.revealCards) {
                  toast({
                    title: "Can't change issue, reveal the cards first",
                  });
                  return;
                }

                setActiveIssue(issue);
              }}
            />
          ))}
      </AnimatePresence>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent
          onCloseAutoFocus={() => {
            const input = document.querySelector(
              "[data-testid=create-issue-input]",
            ) as HTMLInputElement;

            if (input) {
              input.focus();
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete all issues?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You can undo this action by pressing <Kbd>Command</Kbd> +{" "}
              <Kbd>z</Kbd>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onKeyDown={getHotkeyHandler([
                ["Enter", () => setDeleteOpen(false)],
              ])}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              autoFocus={deleteOpen}
              onKeyDown={getHotkeyHandler([
                [
                  "Enter",
                  () => {
                    setDeleteOpen(false);
                    onDeleteAll();
                  },
                ],
              ])}
              onClick={() => {
                setDeleteOpen(false);
                onDeleteAll();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
};

export const Issues = () => {
  const open = useSnapshot(state).issuesOpen;
  const buttonRef = useRef<HTMLButtonElement>(null);
  useVimNavigation();
  const { ref, focused } = useFocusWithin();

  useHotkeys([
    [
      "Escape",
      () => {
        if (state.issuesOpen && focused) {
          state.issuesOpen = false;

          buttonRef.current?.focus();
        }
      },
      { preventDefault: false },
    ],
  ]);

  useHotkeys([
    [
      "i",
      () => {
        state.issuesOpen = true;
      },
    ],
  ]);

  return (
    <Sheet
      modal={false}
      open={open}
      defaultOpen={true}
      onOpenChange={(open) => {
        state.issuesOpen = open;
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button ref={buttonRef} variant="ghost" size={"icon"}>
                {open ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <title>Open</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 5.25C1 3.45508 2.45508 2 4.25 2H11.75C13.5449 2 15 3.45508 15 5.25V10.7499C15 12.5449 13.5449 13.9999 11.75 13.9999H4.25C2.45508 13.9999 1 12.5449 1 10.7499V5.25ZM4.5 12.4999C3.39543 12.4999 2.5 11.6045 2.5 10.4999V5.5C2.5 4.39543 3.39543 3.5 4.5 3.5H9V12.4999H4.5Z"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <title>Closed</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.25 2C2.45508 2 1 3.45508 1 5.25V10.7499C1 12.5449 2.45508 13.9999 4.25 13.9999H11.75C13.5449 13.9999 15 12.5449 15 10.7499V5.25C15 3.45508 13.5449 2 11.75 2H4.25ZM2.5 10.4999C2.5 11.6045 3.39543 12.4999 4.5 12.4999H11.75C12.7165 12.4999 13.5 11.7164 13.5 10.7499V5.25C13.5 4.28351 12.7165 3.5 11.75 3.5H4.5C3.39543 3.5 2.5 4.39543 2.5 5.5V10.4999Z"
                    />
                    <rect x="9" y="3" width="1.5" height="10" />
                  </svg>
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>
              {state.issuesOpen ? "Close issues panel" : "Open issues panel"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent
        ref={ref}
        className="m-auto top-[114px] sm:max-w-full md:max-w-full w-full lg:w-full lg:max-w-[370px] data-[state=open]:slide-in-from-right p-0"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetHeader className={"p-4 px-4 mx-1"}>
          <SheetTitle>Issues</SheetTitle>
          <CreateIssueForm />
        </SheetHeader>

        <IssueList />
      </SheetContent>
    </Sheet>
  );
};

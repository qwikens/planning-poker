import { useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
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

import { Issue, useDocuments } from "@/hooks/useRealtime";
import { state } from "@/store";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { getSession } from "@/lib/session";

const IssueSchema = z.object({
	title: z.string().min(1),
});

const CreateIssueForm = () => {
	const { issues } = useDocuments();
	const id = useParams().id;
	const inputRef = useRef<HTMLInputElement>(null);

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const userId = getSession();
		if (!userId) return;

		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const title = formData.get("title");

		try {
			const data = IssueSchema.parse({
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
						link: "https://qwikens.com",
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
				ref={inputRef}
			/>
			<Button variant="outline">Add an issue</Button>
		</form>
	);
};

const IssueList = () => {
	const snap = useSnapshot(state);
	const id = useParams().id;
	const { room } = useDocuments();

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

	if (!roomState) {
		return null;
	}

	return (
		<ScrollArea className="h-[78dvh] rounded-md pb-10">
			<AnimatePresence initial={false}>
				{roomIssues
					.slice()
					.reverse()
					.map((issue) => (
						<motion.div
							key={issue.id}
							style={{ overflow: "hidden" }}
							className="flex flex-col gap-2 p-4 mt-2 border rounded-md border-border"
						>
							<div>
								<p>{issue.title}</p>
							</div>

							<div className="flex items-center gap-2 mt-2">
								<Button
									onClick={() => {
										setActiveIssue(issue);
									}}
									variant={
										roomState?.currentVotingIssue?.id === issue.id
											? "default"
											: "secondary"
									}
									className="max-w-fit"
								>
									{roomState?.currentVotingIssue?.id === issue.id
										? "Voting now..."
										: "Vote this issue"}
								</Button>

								<div className="flex items-center gap-2">
									{issue.storyPoints}
								</div>
							</div>
						</motion.div>
					))}
			</AnimatePresence>
		</ScrollArea>
	);
};

export const Issues = () => {
	const open = useSnapshot(state).issuesOpen;
	const buttonRef = useRef<HTMLButtonElement>(null);

	useHotkeys(
		[
			[
				"Escape",
				() => {
					if (state.issuesOpen) {
						state.issuesOpen = false;

						buttonRef.current?.focus();
					}
				},
			],
		],
		[],
	);

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
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<SheetTrigger asChild>
							<Button ref={buttonRef} variant="outline">
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
				className="m-auto top-[114px] sm:max-w-full md:max-w-full w-full lg:w-full lg:max-w-[420px] data-[state=open]:slide-in-from-right"
				onInteractOutside={(event) => event.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle>Issues</SheetTitle>
					<SheetDescription>Create issues and vote</SheetDescription>
					<CreateIssueForm />
					<IssueList />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

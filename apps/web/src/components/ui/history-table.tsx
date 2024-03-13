import { HeaderLeft } from "@/components/header-left.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useExportToCsv from "@/hooks/useExportToCSV.ts";
import { HocusPocusProvider } from "@/hooks/useHocuspocus.tsx";
import { RealtimeProvider, VotingHistory } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { ydoc } from "@/yjsDoc.ts";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

// prepare data to be exported, join the votes into a string
const prepareData = (data: VotingHistory[]) => {
	return data.map((line) => {
		return {
			id: line.id,
			issueName: line.issueName,
			votes: line.votes
				.map((vote) => `${vote.votedBy} : ${vote.vote}`)
				.join(", "),
			agreement: line.agreement,
		};
	});
};

const DataTable = ({ id }: { id: string }) => {
	const { votingHistory } = useSnapshot(state);

	const currentVotingHistory = votingHistory[id];

	const exportToCsv = useExportToCsv("my-data.csv");

	return (
		<>
			<Button
				className={"w-fit self-end"}
				// @ts-expect-error mismatch of types, readonly needs fixing
				onClick={() => exportToCsv(prepareData(currentVotingHistory))}
			>
				Export to csv
			</Button>
			<Table>
				<TableCaption>A list of your recent votes.</TableCaption>
				{/*needs to add the export csv here*/}
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead className="">Issue title</TableHead>
						<TableHead className="text-right">Votes</TableHead>
						<TableHead className={"text-right"}>Agreement</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentVotingHistory.map((line) => (
						<TableRow key={line.id}>
							<TableCell className="font-medium">{line.id}</TableCell>
							<TableCell>{line.issueName}</TableCell>
							<TableCell className="text-right">
								{line.votes.map((vote) => (
									<span>
										{vote.votedBy} : {vote.vote}
									</span>
								))}
							</TableCell>
							<TableCell className="text-right">{line.agreement}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={2}>Total</TableCell>
						<TableCell className="text-right">6 votes</TableCell>
						<TableCell className="text-right">32 points</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</>
	);
};

export const HistoryTable = () => {
	const id = useParams().id;
	const snapRoom = useSnapshot(state);

	if (!id) {
		return <div>Room id is required</div>;
	}

	if (
		!ydoc.getMap(`vote-history${id}`).get(id) ||
		!snapRoom.votingHistory[id]
	) {
		// needs sync
		return (
			<HocusPocusProvider roomId={id} ydoc={ydoc}>
				<RealtimeProvider>
					<div />
				</RealtimeProvider>
			</HocusPocusProvider>
		);
	}

	return (
		<HocusPocusProvider roomId={id} ydoc={ydoc}>
			<RealtimeProvider>
				<div className="flex flex-col min-h-[100dvh]">
					<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
						<HeaderLeft id={id} />
					</nav>
					<div
						className={
							"max-w-[1200px] w-full mt-10 px-4 flex flex-col gap-4 my-0 mx-auto"
						}
					>
						<DataTable id={id} />
					</div>
				</div>
			</RealtimeProvider>
		</HocusPocusProvider>
	);
};

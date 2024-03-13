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
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

/* prepare data to be exported, join the votes into a string */
const prepareData = (data: VotingHistory[]) => {
  return data.map((row) => {
    return {
      Id: row.id,
      "Issue title": row.issueName,
      "Voted by": row.votes.map((vote) => vote.votedBy.name).join(", "),
      Vote: row.votes.map((vote) => vote.vote).join(", "),
      Agreement: row.agreement,
    };
  });
};

const DataTable = ({ id }: { id: string }) => {
  const { votingHistory } = useSnapshot(state);

  const currentVotingHistory = votingHistory[id];

  const exportToCsv = useExportToCsv(
    `${new Date().toLocaleDateString()}-voting-history.csv`,
  );

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
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="">Issue title</TableHead>
            <TableHead className="text-right">Voted by</TableHead>
            <TableHead className="text-right">Vote</TableHead>
            <TableHead className="text-right">Agreement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentVotingHistory.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.issueName}</TableCell>
              <TableCell className="text-right">
                {row.votes.map((vote) => vote.votedBy.name).join(", ")}
              </TableCell>
              <TableCell className="text-right">
                {row.votes.map((vote) => vote.vote).join(", ")}
              </TableCell>
              <TableCell className="text-right">{row.agreement}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {currentVotingHistory.length} rounds
            </TableCell>
            <TableCell className="text-right">
              {currentVotingHistory.reduce(
                (acc, row) =>
                  acc +
                  row.votes
                    .filter((vote) => typeof vote.vote === "number")
                    .reduce((acc, vote) => acc + Number(vote.vote), 0),
                0,
              )}{" "}
              points
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

const HistoryTable: FC<{ roomId: string }> = ({ roomId }) => {
  const snapRoom = useSnapshot(state);

  if (
    !ydoc.getMap(`vote-history${roomId}`).get(roomId) ||
    !snapRoom.votingHistory[roomId]
  ) {
    // needs sync
    return <div />;
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
        <HeaderLeft id={roomId} />
      </nav>
      <div
        className={
          "max-w-[1200px] w-full mt-10 px-4 flex flex-col gap-4 my-0 mx-auto"
        }
      >
        <DataTable id={roomId} />
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
        <HistoryTable roomId={roomId} />
      </RealtimeProvider>
    </HocusPocusProvider>
  );
};
Component.displayName = "HistoryTable";

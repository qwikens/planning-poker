import { test } from "@playwright/test";
import { Chance } from "chance";
import { copyInviteLink } from "./routines/copy-invite-link";
import { createIssue } from "./routines/create-issue";
import { createRoom } from "./routines/create-room";
import { ensureAllEstimationsRevealed } from "./routines/ensure-all-estimations-revealed";
import { ensureAllPlayersPresent } from "./routines/ensure-all-players-present";
import { ensureIssueActive } from "./routines/ensure-issue-active";
import { joinRoom } from "./routines/join-room";
import { selectIssueToVote } from "./routines/select-issue-to-vote";
import { voteIssue } from "./routines/vote-issue";

const chance = new Chance();

const fibonacciNumbers = ["1", "2", "3", "5", "8", "13", "21", "34"];

test("session creation", async ({ browser }) => {
  const player1Name = chance.name();
  const player2Name = chance.name();
  const gameName = chance.word();
  const issueName = chance.sentence({ words: 3 });

  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const adminPage = await context.newPage();

  await createRoom({
    page: adminPage,
    gameName,
    userName: player1Name,
  });

  await createIssue({ page: adminPage, issueName: issueName });
  await selectIssueToVote({ page: adminPage, issueName: issueName });
  await ensureIssueActive({ page: adminPage, issueName: issueName });
  const inviteLink = await copyInviteLink(adminPage);

  const secondPlayerPage = await browser.newPage();
  await joinRoom({
    page: secondPlayerPage,
    userName: player2Name,
    gameUrl: inviteLink,
  });

  await ensureAllPlayersPresent(
    [adminPage, secondPlayerPage],
    [player1Name, player2Name],
  );

  const adminVote = chance.pickone(fibonacciNumbers);
  const playerVote = chance.pickone(fibonacciNumbers);

  await voteIssue({ page: adminPage, vote: adminVote });
  await voteIssue({ page: secondPlayerPage, vote: playerVote });

  await adminPage.getByText("Reveal cards").click();

  const votes = [adminVote, playerVote].map((vote) => parseInt(vote));

  const averageVote = Math.round(
    votes.reduce((a, b) => a + b, 0) / votes.length,
  );

  await ensureAllEstimationsRevealed({
    pages: [adminPage, secondPlayerPage],
    average: averageVote,
  });
});

import { test } from "@playwright/test";
import { Chance } from "chance";
import { copyInviteLink } from "./routines/copy-invite-link";
import { createRoom } from "./routines/create-room";
import { ensureAllPlayersAreNotPresent } from "./routines/ensure-all-players-are-not-present";
import { ensureAllPlayersPresent } from "./routines/ensure-all-players-present";
import { joinRoom } from "./routines/join-room";

const chance = new Chance();

test("logout", async ({ browser }) => {
  const player1Name = chance.name();
  const player2Name = chance.name();
  const gameName = chance.word();

  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const adminPage = await context.newPage();

  await createRoom({
    page: adminPage,
    gameName,
    userName: player1Name,
  });

  const inviteLink = await copyInviteLink(adminPage);

  // open new playwright session
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

  await secondPlayerPage.getByRole("button", { name: gameName }).click();
  await secondPlayerPage.getByText("Logout").click();
  // playwright is not disconnecting the page, so we need to reload it
  await secondPlayerPage.reload();
  await ensureAllPlayersAreNotPresent([adminPage], [player2Name]);
});

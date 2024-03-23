import { expect, test } from "@playwright/test";
import { Chance } from "chance";
import { createIssue } from "./routines/create-issue";
import { createRoom } from "./routines/create-room";
import { joinRoom } from "./routines/join-room";

const chance = new Chance();

test("session creation", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();

  const player1Name = chance.name();
  const gameName = chance.word();

  await createRoom({
    page: page,
    gameName,
    userName: player1Name,
  });

  const issueName = chance.sentence({ words: 3 });
  await createIssue({ page: page, issueName: issueName });
  await page.getByText(`${issueName}-`).click();
  // assert page title
  await expect(page).toHaveTitle(new RegExp(`Voting ${issueName}`));
  await expect(
    page.getByRole("heading", { name: issueName }).locator("span"),
  ).toBeVisible();

  // click invite players and get the clipboard text
  await page.getByRole("button", { name: "Invite players" }).click();
  const clipboardText = await page.evaluate(() => {
    return navigator.clipboard.readText();
  });

  // open new playwright session
  const secondPlayerPage = await browser.newPage();
  const player2Name = chance.name();

  // navigate to the clipboard text and join the room
  await joinRoom({
    page: secondPlayerPage,
    userName: player2Name,
    gameUrl: clipboardText,
  });

  // assert both players are in the room
  await expect(page.getByText(player1Name)).toBeVisible();
  await expect(secondPlayerPage.getByText(player2Name)).toBeVisible();

  await page.getByRole("button", { name: "2", exact: true }).click();
  await secondPlayerPage
    .getByRole("button", { name: "2", exact: true })
    .click();

  await page.getByText("Reveal cards").click();
});

import { expect, test } from "@playwright/test";
import { Chance } from "chance";
import { createIssue } from "./routines/create-issue";
import { createRoom } from "./routines/create-room";
import { ensureIssueActive } from "./routines/ensure-issue-active";

const chance = new Chance();

test("keyboard shortcuts", async ({ browser }) => {
  const player1Name = chance.name();
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

  // esc close issues panel
  await adminPage.keyboard.press("Escape");
  // remove focus

  await adminPage.waitForSelector('[data-testid="issues-panel"]', {
    state: "hidden",
  });

  await expect(adminPage.getByTestId("help-dialog")).toBeHidden();

  // // ? open help
  await adminPage.keyboard.down("Shift");
  await adminPage.keyboard.press("?");

  await expect(adminPage.getByRole("dialog")).toBeVisible();

  await adminPage.keyboard.down("Shift");
  await adminPage.keyboard.press("?");
  await expect(adminPage.getByTestId("help-dialog")).toBeHidden();

  // // i open issues panel
});

import { expect, test } from "@playwright/test";
import { Chance } from "chance";
import { createRoom } from "./routines/create-room";

const chance = new Chance();

test("presses keyboard shortcuts", async ({ browser }) => {
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
  await adminPage.getByTestId("create-issue-input").blur();

  await adminPage.keyboard.press("Escape");

  await adminPage.waitForSelector('[label="issues"]', {
    state: "hidden",
  });

  await expect(adminPage.getByTestId("help-dialog")).toBeHidden();

  await adminPage.keyboard.down("Shift");
  await adminPage.keyboard.press("?");

  await adminPage.waitForSelector('[role="dialog"]', {
    state: "visible",
  });

  await adminPage.keyboard.down("Shift");
  await adminPage.keyboard.press("?");

  await adminPage.waitForSelector('[role="dialog"]', {
    state: "hidden",
  });
});

import { expect, test } from "@playwright/test";
import { Chance } from "chance";
import { createIssue } from "./routines/create-issue";
import { createRoom } from "./routines/create-room";

const chance = new Chance();

test("issue deletion", async ({ browser }) => {
  const player1Name = chance.name();
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

  await expect(adminPage.getByTestId(`issue-${issueName}`)).toBeVisible();

  await adminPage.getByLabel(`More actions for issue ${issueName}`).click();
  await adminPage.getByRole("menuitem", { name: "Delete" }).click();
  await expect(
    adminPage.getByRole("heading", { name: "You are deleting the issue:" }),
  ).toBeVisible();
  await adminPage.getByTestId("delete-issue").click();

  await expect(adminPage.getByTestId(`issue-${issueName}`)).toBeHidden();
  await expect(adminPage.getByTestId("create-issue-input")).toBeFocused();

  await createIssue({ page: adminPage, issueName: issueName });
  await expect(adminPage.getByTestId(`issue-${issueName}`)).toBeVisible();

  await adminPage.keyboard.press("Tab");
  await adminPage.keyboard.down("Meta");
  await adminPage.keyboard.press("Backspace");

  await expect(
    adminPage.getByRole("heading", { name: "You are deleting the issue:" }),
  ).toBeVisible();

  await adminPage.getByTestId("delete-issue").click();
  await expect(adminPage.getByTestId(`issue-${issueName}`)).toBeHidden();
});

test("all issue deletion", async ({ browser }) => {
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

  // create 4 issues using a loop
  for (let i = 0; i < 4; i++) {
    const issueName = chance.sentence({ words: 3 });
    await createIssue({ page: adminPage, issueName: issueName });
    await expect(adminPage.getByTestId(`issue-${issueName}`)).toBeVisible();
  }

  await adminPage.keyboard.press("Tab");
  await adminPage.keyboard.down("Shift");
  await adminPage.keyboard.down("Meta");
  await adminPage.keyboard.press("Backspace");

  await expect(
    adminPage.getByRole("heading", { name: "Are you sure you want to" }),
  ).toBeVisible();

  await adminPage.getByRole("button", { name: "Continue" }).click();
  await expect(adminPage.getByTestId("create-issue-input")).toBeFocused();
});

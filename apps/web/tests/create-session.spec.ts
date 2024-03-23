import { type Page, expect, test } from "@playwright/test";

async function createRoom({
  page,
  gameName,
  userName,
}: { page: Page; gameName: string; userName: string }): Promise<void> {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Start new game" }).click();
  await page.getByPlaceholder("Game Name").fill(gameName);
  await page.getByPlaceholder("User Name").fill(userName);
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForNavigation();
}

async function createIssue({
  page,
  issueName,
}: { page: Page; issueName: string }): Promise<void> {
  await page.getByTestId("create-issue-input").fill(issueName);
  await page.getByTestId("create-issue-input").press("Enter");
}

async function joinRoom({
  page,
  userName,
  gameUrl,
}: { page: Page; gameUrl: string; userName: string }): Promise<void> {
  await page.goto(gameUrl);
  await page.getByPlaceholder("User Name").fill(userName);
  await page.getByRole("button", { name: "Join" }).click();
}

test.only("creates session", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });

  const page = await context.newPage();

  await createRoom({
    page: page,
    gameName: "Planning Poker Game",
    userName: "Julio Merisio",
  });

  const issueName = "Issue 1";
  await createIssue({ page: page, issueName: issueName });

  await page.getByText(`${issueName}-`).click();

  // assert page title
  await expect(page).toHaveTitle(/Voting Issue 1/);

  await page.getByRole("heading", { name: issueName }).locator("span").click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByText("Reveal cards").click();

  // click invite players and get the clipboard text
  await page.getByRole("button", { name: "Invite players" }).click();
  const clipboardText = await page.evaluate(() => {
    return navigator.clipboard.readText();
  });

  // open new playwright session
  const secondPlayerPage = await browser.newPage();

  // navigate to the clipboard text and join the room
  await joinRoom({
    page: secondPlayerPage,
    userName: "Aluisio",
    gameUrl: clipboardText,
  });

  // assert both players are in the room
  await expect(page.getByText("Julio Merisio")).toBeVisible();
  await expect(secondPlayerPage.getByText("Aluisio")).toBeVisible();
});

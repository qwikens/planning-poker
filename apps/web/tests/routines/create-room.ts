import type { Page } from "@playwright/test";

export const createRoom = async ({
  page,
  gameName,
  userName,
}: {
  page: Page;
  gameName: string;
  userName: string;
}): Promise<void> => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Start new game" }).click();
  await page.getByPlaceholder("Game Name").fill(gameName);
  await page.getByPlaceholder("User Name").fill(userName);
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForNavigation();
};

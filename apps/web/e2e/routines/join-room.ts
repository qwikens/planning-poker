import type { Page } from "@playwright/test";

export const joinRoom = async ({
  page,
  userName,
  gameUrl,
}: {
  page: Page;
  gameUrl: string;
  userName: string;
}): Promise<void> => {
  await page.goto(gameUrl);
  await page.getByPlaceholder("User Name").fill(userName);
  await page.getByRole("button", { name: "Join" }).click();
};

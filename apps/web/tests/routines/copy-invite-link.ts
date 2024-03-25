import { Page } from "@playwright/test";

export const copyInviteLink = async (page: Page): Promise<string> => {
  await page.getByRole("button", { name: "Invite players" }).click();
  return page.evaluate(() => navigator.clipboard.readText());
};

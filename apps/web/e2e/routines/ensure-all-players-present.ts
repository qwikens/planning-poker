import { Page, expect } from "@playwright/test";

export const ensureAllPlayersPresent = async (
  pages: Page[],
  playerNames: string[],
): Promise<void> => {
  for (let i = 0; i < pages.length; i++) {
    await expect(pages[i].getByText(playerNames[i])).toBeVisible();
  }
};

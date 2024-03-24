import { Page, expect } from "@playwright/test";

export const ensureAllPlayersAreNotPresent = async (
  pages: Page[],
  playerNames: string[],
): Promise<void> => {
  for (let i = 0; i < pages.length; i++) {
    await pages[i].waitForSelector(`text=${playerNames[i]}`, {
      state: "detached",
    });
  }
};

import { Page, expect } from "@playwright/test";

export const ensureAllEstimationsRevealed = async ({
  pages,
  average,
}: { pages: Page[]; average: number }) => {
  for (const page of pages) {
    await expect(page.getByText(`Rounded Average:${average}`)).toBeVisible();
    await expect(page.getByText("Vote again")).toBeVisible();
    await expect(page.getByText("Vote next")).toBeVisible();
  }
};

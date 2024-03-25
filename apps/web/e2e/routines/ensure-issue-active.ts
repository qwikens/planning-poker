import { Page, expect } from "@playwright/test";

export const ensureIssueActive = async ({
  page,
  issueName,
}: { page: Page; issueName: string }): Promise<void> => {
  await expect(page).toHaveTitle(new RegExp(`Voting ${issueName}`));
  await expect(
    page.getByRole("heading", { name: issueName }).locator("span"),
  ).toBeVisible();
};

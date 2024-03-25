import { Page } from "@playwright/test";

export const selectIssueToVote = async ({
  page,
  issueName,
}: { page: Page; issueName: string }) => {
  await page.getByText(`${issueName}-`).click();
};

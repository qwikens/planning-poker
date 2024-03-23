import type { Page } from "@playwright/test";

export const createIssue = async ({
  page,
  issueName,
}: {
  page: Page;
  issueName: string;
}): Promise<void> => {
  await page.getByTestId("create-issue-input").fill(issueName);
  await page.getByTestId("create-issue-input").press("Enter");
};

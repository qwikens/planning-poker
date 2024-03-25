import { Page } from "@playwright/test";

export const voteIssue = async ({
  page,
  vote,
}: {
  page: Page;
  vote: string;
}): Promise<void> => {
  await page.getByRole("button", { name: vote, exact: true }).click();
};

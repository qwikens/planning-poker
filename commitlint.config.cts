import type { UserConfig } from "@commitlint/types";

/**
 * When to use each commit type:
 *
 * - `feat`: A new feature or functionality added to the codebase. Use this commit
 *   type when a new feature is added to the codebase.
 * - `fix`: A bug fix or error correction. Use this commit type when a bug is
 *   fixed on the codebase.
 * - `docs`: Documentation updates. Use this commit type when the documentation of
 *   the codebase is updated.
 * - `style`: Code formatting or styling changes. Use this commit type when
 *   changes are made to the code formatting, indentation, or any other
 *   non-functional aspect of the code.
 * - `refactor`: Code refactoring or restructuring. Use this commit type when
 *   changes are made to the code structure or architecture without changing its
 *   functionality.
 * - `test`: Test-related changes. Use this commit type when changes are made to
 *   the tests of the codebase.
 * - `chore`: Miscellaneous changes. Use this commit type for any other changes
 *   that don't fit into the other categories.
 *
 * Example commit messages:
 *
 * - `feat`: add user authentication to login page
 * - `fix`: fix error handling in user registration process
 * - `docs`: update API documentation for v1.2
 * - `style`: format code according to Prettier rules
 * - `refactor`: restructure file organization for better scalability
 * - `test`: add unit tests for user profile page
 * - `chore`: update dependencies to latest versions
 */
const configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
};

export default configuration;

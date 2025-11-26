/**
 * Bugs to Jira Bridge - Coordinate between local bugs and Jira
 */

import type { Bug } from "../../config/loadBugs.js";

/**
 * Create a Jira issue from a local bug
 */
export async function createJiraIssueFromBug(bug: Bug): Promise<string> {
  // Future: call jira-mate to create Jira issue
  // Update bug.jiraKey once issue is created
  throw new Error("Not implemented yet");
}

/**
 * Sync local bug with Jira issue
 */
export async function syncBugWithJira(bugId: string): Promise<void> {
  // Future: keep local and Jira states aligned
  throw new Error("Not implemented yet");
}


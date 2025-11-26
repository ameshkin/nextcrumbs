/**
 * Bugs Registry - Local bug management
 */

import type { Bug } from "../../config/loadBugs.js";

/**
 * Add a new bug to the registry
 */
export function addBug(bug: Omit<Bug, "createdAt" | "updatedAt">): Bug {
  // Future: create entry in bugs.json
  throw new Error("Not implemented yet");
}

/**
 * Get all bugs
 */
export function getAllBugs(): Bug[] {
  // Future: read from bugs.json
  throw new Error("Not implemented yet");
}

/**
 * Update a bug
 */
export function updateBug(id: string, updates: Partial<Bug>): Bug {
  // Future: update entry in bugs.json
  throw new Error("Not implemented yet");
}


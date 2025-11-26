/**
 * UI Model - Declarative description of UI sections and widgets
 */

export type UiSectionId = "rules" | "bugs" | "jira" | "packages" | "routes";

export interface UiSection {
  id: UiSectionId;
  title: string;
  description?: string;
  enabled: boolean;
}

/**
 * Build UI sections from project rules
 */
export function buildUiSections(): UiSection[] {
  // Future: read project-rules and construct sections
  return [];
}


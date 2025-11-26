/**
 * Next.js Route Generation
 * 
 * Functions that generate route definitions/components for a Next.js app
 */

import type { UiSection } from "../../domain/ui/uiModel.js";

export interface NextRouteSpec {
  path: string;
  sectionId: string;
}

/**
 * Build Next.js route specifications from UI sections
 */
export function buildNextRouteSpecs(sections: UiSection[]): NextRouteSpec[] {
  // Future: map sections to /orchestrator/* routes
  return [];
}


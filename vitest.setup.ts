import "@testing-library/jest-dom";

import { vi } from "vitest";

// Example: minimal next/navigation mocks if you need them in tests
vi.mock("next/navigation", () => {
  return {
    usePathname: () => "/products/new",
  };
});

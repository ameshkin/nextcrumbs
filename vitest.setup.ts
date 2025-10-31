import { expect, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/link", async () => {
  const mod = await import("./src/mocks/nextLinkMock");
  return { default: mod.default };
});

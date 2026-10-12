import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional class names", () => {
    const isPrimary = true;
    const isHidden = false;
    expect(cn("btn", isPrimary && "btn-primary", isHidden && "hidden")).toBe("btn btn-primary");
  });

  it("resolves conflicting tailwind classes safely", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });
});

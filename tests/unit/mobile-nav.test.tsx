import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileNav } from "@/components/layout/mobile-nav";

describe("MobileNav component", () => {
  it("renders mobile drawer trigger button", () => {
    render(<MobileNav />);
    const trigger = screen.getByRole("button", { name: /open mobile navigation menu/i });
    expect(trigger).toBeInTheDocument();
  });
});

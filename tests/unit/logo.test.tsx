import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/layout/logo";

describe("Logo component", () => {
  it("renders with AeroBook wordmark and link to home", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: /aerobook home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByText("Aero")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();
  });

  it("can hide wordmark if requested", () => {
    render(<Logo showWordmark={false} />);
    expect(screen.queryByText("Aero")).not.toBeInTheDocument();
  });
});

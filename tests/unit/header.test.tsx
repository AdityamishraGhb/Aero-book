import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/header";

describe("Header component", () => {
  it("renders the AeroBook logo", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /aerobook home/i })).toBeInTheDocument();
  });

  it("renders active Flights tab", () => {
    render(<Header />);
    const flightsLink = screen.getByRole("link", { name: /^flights$/i });
    expect(flightsLink).toBeInTheDocument();
    expect(flightsLink).toHaveAttribute("aria-current", "page");
  });

  it("renders disabled Stays and Cars tabs marked coming soon", () => {
    render(<Header />);
    const staysElement = screen.getByText("Stays").closest("div");
    expect(staysElement).toHaveAttribute("aria-disabled", "true");

    const carsElement = screen.getByText("Cars").closest("div");
    expect(carsElement).toHaveAttribute("aria-disabled", "true");

    const soonBadges = screen.getAllByText("Soon");
    expect(soonBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("renders Saved Flights link and Account button", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /saved flights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /account/i })).toBeInTheDocument();
  });
});

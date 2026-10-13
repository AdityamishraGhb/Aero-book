import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StickySearchSummary } from "@/components/results/sticky-search-summary";

describe("StickySearchSummary Component", () => {
  it("renders origin, destination, and travellers count", () => {
    render(
      <StickySearchSummary
        from="DEL"
        to="BOM"
        depart="2026-11-20"
        trip="oneway"
        adults={2}
        childrenCount={1}
        infants={0}
        cabin="economy"
        directOnly={false}
      />
    );

    expect(screen.getByText("New Delhi")).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("(DEL)")).toBeInTheDocument();
    expect(screen.getByText("(BOM)")).toBeInTheDocument();
    expect(screen.getByText(/3 Travellers, Economy/i)).toBeInTheDocument();
  });

  it("toggles inline search editor when clicking Edit Search button", () => {
    render(
      <StickySearchSummary
        from="DEL"
        to="BOM"
        depart="2026-11-20"
        trip="oneway"
        adults={1}
        childrenCount={0}
        infants={0}
        cabin="economy"
        directOnly={false}
      />
    );

    const editButton = screen.getByRole("button", { name: /edit search/i });
    expect(screen.queryByTestId("flight-search-panel")).not.toBeInTheDocument();

    fireEvent.click(editButton);

    expect(screen.getByTestId("flight-search-panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close editor/i })).toBeInTheDocument();
  });
});

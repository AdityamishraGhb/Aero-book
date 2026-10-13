import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortTabs } from "@/components/results/sort-tabs";

describe("SortTabs Component", () => {
  it("renders Best, Cheapest, and Fastest tabs with metrics", () => {
    render(
      <SortTabs
        currentSort="best"
        onSortChange={vi.fn()}
        minPrice={3999}
        minDurationMinutes={130}
        bestScore={9.2}
      />
    );

    expect(screen.getByRole("tab", { name: /best/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /cheapest/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /fastest/i })).toBeInTheDocument();
    expect(screen.getByText(/score: 9.2\/10/i)).toBeInTheDocument();
    expect(screen.getByText(/from ₹\s?3,999/i)).toBeInTheDocument();
    expect(screen.getByText(/from 2h 10m/i)).toBeInTheDocument();
  });

  it("calls onSortChange when clicking a tab", () => {
    const handleSortChange = vi.fn();
    render(<SortTabs currentSort="best" onSortChange={handleSortChange} minPrice={3999} />);

    const cheapestTab = screen.getByRole("tab", { name: /cheapest/i });
    fireEvent.click(cheapestTab);

    expect(handleSortChange).toHaveBeenCalledWith("cheapest");
  });
});

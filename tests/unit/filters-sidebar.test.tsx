import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FiltersSidebar, type FilterState } from "@/components/results/filters-sidebar";

describe("FiltersSidebar Component", () => {
  const defaultFilters: FilterState = {
    stops: "all",
    selectedAirlines: [],
    departureWindow: "all",
    maxPrice: 10000,
  };

  const mockAirlines = [
    { code: "6E", name: "IndiGo", count: 5, minPrice: 4299 },
    { code: "AI", name: "Air India", count: 3, minPrice: 5100 },
  ];

  it("renders stops options, departure times, and airlines", () => {
    render(
      <FiltersSidebar
        filters={defaultFilters}
        onFilterChange={vi.fn()}
        availableAirlines={mockAirlines}
        minPricePossible={3500}
        maxPricePossible={15000}
        onResetFilters={vi.fn()}
      />
    );

    expect(screen.getByText("Filter Flights")).toBeInTheDocument();
    expect(screen.getByText("Any number of stops")).toBeInTheDocument();
    expect(screen.getByText("Non-stop only")).toBeInTheDocument();
    expect(screen.getByText("IndiGo")).toBeInTheDocument();
    expect(screen.getByText("Air India")).toBeInTheDocument();
  });

  it("updates stops filter on radio change", () => {
    const handleFilterChange = vi.fn();
    render(
      <FiltersSidebar
        filters={defaultFilters}
        onFilterChange={handleFilterChange}
        availableAirlines={mockAirlines}
        minPricePossible={3500}
        maxPricePossible={15000}
        onResetFilters={vi.fn()}
      />
    );

    const nonStopRadio = screen.getByLabelText(/non-stop only/i);
    fireEvent.click(nonStopRadio);

    expect(handleFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      stops: "0",
    });
  });

  it("calls onResetFilters when clicking Reset button", () => {
    const handleReset = vi.fn();
    render(
      <FiltersSidebar
        filters={{ ...defaultFilters, stops: "0" }}
        onFilterChange={vi.fn()}
        availableAirlines={mockAirlines}
        minPricePossible={3500}
        maxPricePossible={15000}
        onResetFilters={handleReset}
      />
    );

    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/results/empty-state";

describe("EmptyState Component", () => {
  it("renders default title and description", () => {
    render(<EmptyState />);
    expect(screen.getByTestId("empty-results-state")).toBeInTheDocument();
    expect(screen.getByText("No flights matching your active filters")).toBeInTheDocument();
  });

  it("triggers onResetFilters callback when reset button is clicked", () => {
    const handleReset = vi.fn();
    render(<EmptyState onResetFilters={handleReset} />);

    const resetButton = screen.getByRole("button", { name: /reset all filters/i });
    fireEvent.click(resetButton);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

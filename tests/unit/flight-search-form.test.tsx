import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FlightSearchForm } from "@/components/search/flight-search-form";
import * as navigation from "next/navigation";

describe("FlightSearchForm Component", () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(navigation, "useRouter").mockReturnValue({
      push: pushMock,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as unknown as ReturnType<typeof navigation.useRouter>);
  });

  it("renders search panel with sensible defaults (DEL to BOM)", () => {
    render(<FlightSearchForm />);
    expect(screen.getByTestId("flight-search-panel")).toBeInTheDocument();
    expect(screen.getByText("New Delhi")).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search flights/i })).toBeInTheDocument();
  });

  it("swaps origin and destination airports when clicking swap button", async () => {
    render(<FlightSearchForm />);

    const swapButton = screen.getByRole("button", {
      name: /swap origin and destination airports/i,
    });

    fireEvent.click(swapButton);

    await waitFor(() => {
      // In from combobox, should now be Mumbai; in to combobox, should now be New Delhi
      const fromTrigger = screen.getByRole("combobox", { name: /from: mumbai/i });
      const toTrigger = screen.getByRole("combobox", { name: /to: new delhi/i });
      expect(fromTrigger).toBeInTheDocument();
      expect(toTrigger).toBeInTheDocument();
    });
  });

  it("shows return date input when switching to Round-trip and hides it on One-way", async () => {
    render(<FlightSearchForm />);

    // Initially One-way: Return date is hidden
    expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();

    // Click Round-trip
    const roundTripButton = screen.getByRole("button", { name: /round-trip/i });
    fireEvent.click(roundTripButton);

    // Now Return date input should appear
    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();

    // Switch back to One-way
    const oneWayButton = screen.getByRole("button", { name: /one-way/i });
    fireEvent.click(oneWayButton);

    expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument();
  });

  it("navigates to /flights/{ORIGIN}-{DEST} on form submission", async () => {
    render(
      <FlightSearchForm
        initialValues={{
          from: "DEL",
          to: "BOM",
          depart: "2026-11-20",
          trip: "oneway",
          adults: 1,
          cabin: "economy",
        }}
      />
    );

    const submitButton = screen.getByRole("button", { name: /search flights/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
      const targetUrl = pushMock.mock.calls[0][0];
      expect(targetUrl).toContain("/flights/DEL-BOM");
      expect(targetUrl).toContain("depart=2026-11-20");
      expect(targetUrl).toContain("trip=oneway");
    });
  });
});

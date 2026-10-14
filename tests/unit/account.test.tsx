import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountPage from "@/app/account/page";

describe("Account Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders member profile header and tab controls", async () => {
    // Mock API responses
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/user/bookings")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            bookings: [
              {
                id: "b-1",
                bookingReference: "AB-78K29P",
                pnr: "6E-59821",
                carrierCode: "6E",
                carrierName: "IndiGo",
                flightNumber: "6E-204",
                origin: "DEL",
                destination: "BOM",
                departureTime: "2026-11-20T06:00:00",
                arrivalTime: "2026-11-20T08:15:00",
                totalAmount: 4299,
                currency: "INR",
                status: "confirmed",
                passengers: [{ id: "p1", firstName: "Aditya", lastName: "Mishra" }],
              },
            ],
          }),
        });
      }
      if (url.includes("/api/user/saved-searches")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            savedSearches: [
              {
                id: "s-1",
                fromIata: "DEL",
                toIata: "BOM",
                fromCity: "New Delhi",
                toCity: "Mumbai",
                departDate: "2026-11-20",
                trip: "oneway",
                passengers: 1,
                cabin: "economy",
              },
            ],
          }),
        });
      }
      if (url.includes("/api/user/favourite-routes")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            routes: [
              {
                id: "r-1",
                fromIata: "DEL",
                toIata: "BOM",
                fromCity: "New Delhi",
                toCity: "Mumbai",
              },
            ],
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<AccountPage />);

    expect(screen.getByRole("heading", { name: "Aditya Mishra" })).toBeInTheDocument();
    expect(screen.getByText(/verified member/i)).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();

    // Check tab navigation exists
    expect(screen.getByRole("button", { name: /booking history/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /saved searches/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /favourite routes/i })).toBeInTheDocument();

    // Wait for bookings to load
    await waitFor(() => {
      expect(screen.getByText("AB-78K29P")).toBeInTheDocument();
      expect(screen.getByText("6E-59821")).toBeInTheDocument();
      expect(screen.getByText(/IndiGo \(6E-204\)/)).toBeInTheDocument();
    });
  });

  it("switches to Saved Searches tab on click", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        savedSearches: [
          {
            id: "s-1",
            fromIata: "DEL",
            toIata: "BOM",
            fromCity: "New Delhi",
            toCity: "Mumbai",
            departDate: "2026-11-20",
            trip: "oneway",
            passengers: 1,
            cabin: "economy",
          },
        ],
        bookings: [],
        routes: [],
      }),
    });

    render(<AccountPage />);

    const savedTab = screen.getByRole("button", { name: /saved searches/i });
    fireEvent.click(savedTab);

    await waitFor(() => {
      expect(screen.getByText(/New Delhi \(DEL\) ➔ Mumbai \(BOM\)/i)).toBeInTheDocument();
      expect(screen.getByText("Search Again")).toBeInTheDocument();
    });
  });
});

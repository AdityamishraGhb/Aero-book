import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlightCard } from "@/components/results/flight-card";
import type { FlightOffer } from "@/types/flight";

describe("FlightCard Component", () => {
  const mockOffer: FlightOffer = {
    id: "offer-DELBOM-1",
    provider: "mock",
    slices: [
      {
        durationMinutes: 135,
        stops: 0,
        departureAirport: "DEL",
        departureTime: "2026-11-20T06:00:00",
        arrivalAirport: "BOM",
        arrivalTime: "2026-11-20T08:15:00",
        segments: [
          {
            id: "seg-1",
            carrierCode: "6E",
            carrierName: "IndiGo",
            flightNumber: "6E-204",
            aircraft: "Airbus A321neo",
            departureAirport: "DEL",
            departureTerminal: "T3",
            departureTime: "2026-11-20T06:00:00",
            arrivalAirport: "BOM",
            arrivalTerminal: "T2",
            arrivalTime: "2026-11-20T08:15:00",
            durationMinutes: 135,
            cabin: "Economy",
          },
        ],
      },
    ],
    price: {
      amount: 4299,
      currency: "INR",
      baseFare: 3600,
      taxes: 699,
    },
    scoring: {
      bestScore: 9.4,
      priceScore: 9.5,
      durationScore: 9.3,
    },
    cabin: "economy",
    seatsRemaining: 4,
    baggage: {
      cabin: "7 kg",
      checked: "15 kg included",
    },
    amenities: ["Free check-in"],
    bookingUrl: "/book?offerId=offer-DELBOM-1",
  };

  it("renders carrier, times, airports, and price", () => {
    render(<FlightCard offer={mockOffer} />);

    expect(screen.getByText("IndiGo")).toBeInTheDocument();
    expect(screen.getByText("6E-204 • Airbus A321neo")).toBeInTheDocument();
    expect(screen.getByText("DEL")).toBeInTheDocument();
    expect(screen.getByText("BOM")).toBeInTheDocument();
    expect(screen.getByText("2h 15m")).toBeInTheDocument();
    expect(screen.getByText("Non-stop")).toBeInTheDocument();
    expect(screen.getByText(/₹\s?4,299/)).toBeInTheDocument();
  });

  it("displays Best Value badge when isBestOffer is true", () => {
    render(<FlightCard offer={mockOffer} isBestOffer />);
    expect(screen.getByText(/best value • score 9.4\/10/i)).toBeInTheDocument();
  });

  it("triggers onSelect callback when clicking Select Flight button", () => {
    const handleSelect = vi.fn();
    render(<FlightCard offer={mockOffer} onSelect={handleSelect} />);

    const selectButton = screen.getByRole("button", { name: /select flight/i });
    fireEvent.click(selectButton);

    expect(handleSelect).toHaveBeenCalledWith(mockOffer);
  });
});

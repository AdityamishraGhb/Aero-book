import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BookingFlowPage from "@/app/booking/page";
import BookingConfirmationPage from "@/app/booking/confirmation/page";
import { useBookingStore } from "@/lib/store/booking-store";
import type { FlightOffer } from "@/types/flight";

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
  bookingUrl: "/flights/DEL-BOM/offer-DELBOM-1",
};

describe("Booking Pages", () => {
  beforeEach(() => {
    useBookingStore.getState().resetBooking();
  });

  describe("BookingFlowPage", () => {
    it("renders empty state when no offer is selected", () => {
      render(<BookingFlowPage />);
      expect(
        screen.getByRole("heading", { name: /no flight selected for booking/i })
      ).toBeInTheDocument();
    });

    it("renders passenger and contact form when offer is in store", () => {
      useBookingStore.getState().setSelectedOffer(mockOffer);

      render(<BookingFlowPage />);

      expect(
        screen.getByRole("heading", { name: /passenger & contact information/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/passenger 1 \(adult\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first & middle name \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobile number \*/i)).toBeInTheDocument();
    });

    it("validates empty fields on submission", () => {
      useBookingStore.getState().setSelectedOffer(mockOffer);

      render(<BookingFlowPage />);

      const proceedButton = screen.getByRole("button", {
        name: /proceed to review booking/i,
      });
      fireEvent.click(proceedButton);

      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/mobile phone number is required/i)).toBeInTheDocument();
    });

    it("advances to Step 2 Review when valid details are provided", () => {
      useBookingStore.getState().setSelectedOffer(mockOffer);

      render(<BookingFlowPage />);

      const fnInput = screen.getByPlaceholderText(/e\.g\. aditya/i);
      const lnInput = screen.getByPlaceholderText(/e\.g\. mishra/i);
      const emailInput = screen.getByPlaceholderText(/e\.g\. traveller@example\.com/i);
      const phoneInput = screen.getByPlaceholderText(/9876543210/i);

      fireEvent.change(fnInput, { target: { value: "Aditya" } });
      fireEvent.change(lnInput, { target: { value: "Mishra" } });
      fireEvent.change(emailInput, { target: { value: "aditya@aerobook.in" } });
      fireEvent.change(phoneInput, { target: { value: "9876543210" } });

      const proceedButton = screen.getByRole("button", {
        name: /proceed to review booking/i,
      });
      fireEvent.click(proceedButton);

      // Now on Step 2
      expect(
        screen.getByRole("heading", { name: /review your itinerary & payment/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/aditya mishra/i)).toBeInTheDocument();
      expect(screen.getByText(/aditya@aerobook\.in/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm & pay/i)).toBeInTheDocument();
    });
  });

  describe("BookingConfirmationPage", () => {
    it("renders fallback when no confirmed booking exists", () => {
      render(<BookingConfirmationPage />);
      expect(
        screen.getByRole("heading", { name: /no confirmed booking found/i })
      ).toBeInTheDocument();
    });

    it("renders confirmed e-ticket with booking reference and PNR", () => {
      useBookingStore.getState().setSelectedOffer(mockOffer);
      useBookingStore.getState().setPassengers([
        {
          id: "pax-1",
          type: "adult",
          title: "Mr",
          firstName: "Aditya",
          lastName: "Mishra",
          gender: "male",
        },
      ]);
      useBookingStore.getState().setContactDetails({
        email: "aditya@aerobook.in",
        phone: "9876543210",
        countryCode: "+91",
      });

      const confirmed = useBookingStore.getState().completeBooking();

      render(<BookingConfirmationPage />);

      expect(
        screen.getByRole("heading", { name: /thank you! your flight is booked\./i })
      ).toBeInTheDocument();
      expect(screen.getByText(confirmed.bookingReference)).toBeInTheDocument();
      expect(screen.getByText(confirmed.pnr)).toBeInTheDocument();
      expect(screen.getByText("Print E-Ticket")).toBeInTheDocument();
      expect(screen.getByText("Book Another Flight")).toBeInTheDocument();
      expect(screen.getByText(/aditya mishra/i)).toBeInTheDocument();
      expect(screen.getByText(/₹\s?4,299/)).toBeInTheDocument();
    });
  });
});

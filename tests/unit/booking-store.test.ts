import { describe, it, expect, beforeEach } from "vitest";
import { useBookingStore } from "@/lib/store/booking-store";
import type { FlightOffer } from "@/types/flight";

describe("useBookingStore", () => {
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

  beforeEach(() => {
    useBookingStore.getState().resetBooking();
  });

  it("initializes with empty default values", () => {
    const state = useBookingStore.getState();
    expect(state.selectedOffer).toBeNull();
    expect(state.passengers).toEqual([]);
    expect(state.contact).toBeNull();
    expect(state.confirmedBooking).toBeNull();
  });

  it("sets selected offer successfully", () => {
    useBookingStore.getState().setSelectedOffer(mockOffer);
    expect(useBookingStore.getState().selectedOffer).toEqual(mockOffer);
  });

  it("sets passenger details and contact info", () => {
    const passengers = [
      {
        id: "pax-1",
        type: "adult" as const,
        title: "Mr" as const,
        firstName: "Aditya",
        lastName: "Mishra",
        gender: "male" as const,
      },
    ];

    const contact = {
      email: "aditya@aerobook.in",
      phone: "9876543210",
      countryCode: "+91",
    };

    useBookingStore.getState().setPassengers(passengers);
    useBookingStore.getState().setContactDetails(contact);

    expect(useBookingStore.getState().passengers).toEqual(passengers);
    expect(useBookingStore.getState().contact).toEqual(contact);
  });

  it("completes booking and generates booking reference & PNR", () => {
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

    const booking = useBookingStore.getState().completeBooking();

    expect(booking.bookingReference).toMatch(/^AB-[A-Z0-9]{6}$/);
    expect(booking.pnr).toMatch(/^6E-[A-Z0-9]{5}$/);
    expect(booking.status).toBe("confirmed");
    expect(booking.offer.id).toBe("offer-DELBOM-1");
    expect(booking.passengers[0].firstName).toBe("Aditya");
    expect(useBookingStore.getState().confirmedBooking).toEqual(booking);
  });

  it("throws error when completing booking without an offer", () => {
    expect(() => {
      useBookingStore.getState().completeBooking();
    }).toThrowError("No flight offer selected for booking");
  });

  it("resets booking state on resetBooking call", () => {
    useBookingStore.getState().setSelectedOffer(mockOffer);
    useBookingStore.getState().completeBooking();

    useBookingStore.getState().resetBooking();

    const state = useBookingStore.getState();
    expect(state.selectedOffer).toBeNull();
    expect(state.passengers).toEqual([]);
    expect(state.contact).toBeNull();
    expect(state.confirmedBooking).toBeNull();
  });
});

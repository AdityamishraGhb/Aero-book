import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FlightOffer } from "@/types/flight";

export interface PassengerData {
  id: string;
  type: "adult" | "child" | "infant";
  title: "Mr" | "Ms" | "Mrs" | "Master" | "Miss";
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: "male" | "female" | "other";
}

export interface ContactDetails {
  email: string;
  phone: string;
  countryCode: string;
}

export interface BookingRecord {
  bookingReference: string;
  pnr: string;
  offer: FlightOffer;
  passengers: PassengerData[];
  contact: ContactDetails;
  createdAt: string;
  status: "confirmed";
}

interface BookingState {
  selectedOffer: FlightOffer | null;
  passengers: PassengerData[];
  contact: ContactDetails | null;
  confirmedBooking: BookingRecord | null;

  // Actions
  setSelectedOffer: (offer: FlightOffer) => void;
  setPassengers: (passengers: PassengerData[]) => void;
  setContactDetails: (contact: ContactDetails) => void;
  completeBooking: () => BookingRecord;
  resetBooking: () => void;
}

function generateReference(prefix = "AB"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${random}`;
}

function generatePnr(carrierCode = "6E"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${carrierCode}-${random}`;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      selectedOffer: null,
      passengers: [],
      contact: null,
      confirmedBooking: null,

      setSelectedOffer: (offer) => {
        set({ selectedOffer: offer });
      },

      setPassengers: (passengers) => {
        set({ passengers });
      },

      setContactDetails: (contact) => {
        set({ contact });
      },

      completeBooking: () => {
        const state = get();
        if (!state.selectedOffer) {
          throw new Error("No flight offer selected for booking");
        }

        const carrierCode = state.selectedOffer.slices[0]?.segments[0]?.carrierCode || "6E";

        const bookingRecord: BookingRecord = {
          bookingReference: generateReference("AB"),
          pnr: generatePnr(carrierCode),
          offer: state.selectedOffer,
          passengers:
            state.passengers.length > 0
              ? state.passengers
              : [
                  {
                    id: "pax-1",
                    type: "adult",
                    title: "Mr",
                    firstName: "Aditya",
                    lastName: "Mishra",
                    gender: "male",
                  },
                ],
          contact: state.contact || {
            email: "aditya@example.com",
            phone: "9876543210",
            countryCode: "+91",
          },
          createdAt: new Date().toISOString(),
          status: "confirmed",
        };

        set({ confirmedBooking: bookingRecord });
        return bookingRecord;
      },

      resetBooking: () => {
        set({
          selectedOffer: null,
          passengers: [],
          contact: null,
          confirmedBooking: null,
        });
      },
    }),
    {
      name: "aerobook-booking-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.sessionStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

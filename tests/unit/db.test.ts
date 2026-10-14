import { describe, it, expect, beforeEach } from "vitest";
import {
  getUserByEmail,
  getUserById,
  getSavedSearches,
  createSavedSearch,
  deleteSavedSearch,
  getFavouriteRoutes,
  createFavouriteRoute,
  deleteFavouriteRoute,
  getBookings,
  getBookingByReference,
  createBooking,
  memoryDb,
} from "@/lib/db";

describe("Database & ORM Layer", () => {
  const testUserId = "usr-test-123";

  beforeEach(() => {
    // Ensure test user exists in memory fallback
    memoryDb.createUser({
      id: testUserId,
      email: "test@aerobook.in",
      name: "Test User",
    });
  });

  describe("User Retrieval", () => {
    it("fetches user by email address", async () => {
      const user = await getUserByEmail("aditya@aerobook.in");
      expect(user).not.toBeNull();
      expect(user?.email).toBe("aditya@aerobook.in");
      expect(user?.name).toBe("Aditya Mishra");
    });

    it("fetches user by id", async () => {
      const user = await getUserById("usr-demo-1");
      expect(user).not.toBeNull();
      expect(user?.id).toBe("usr-demo-1");
    });
  });

  describe("Saved Searches", () => {
    it("creates, retrieves, and deletes saved searches", async () => {
      const created = await createSavedSearch({
        userId: testUserId,
        fromIata: "BLR",
        toIata: "DEL",
        fromCity: "Bengaluru",
        toCity: "New Delhi",
        departDate: "2026-12-01",
        trip: "oneway",
        passengers: 2,
        cabin: "business",
      });

      expect(created.id).toBeDefined();
      expect(created.fromIata).toBe("BLR");
      expect(created.toIata).toBe("DEL");

      const list = await getSavedSearches(testUserId);
      expect(list.some((s) => s.id === created.id)).toBe(true);

      const deleted = await deleteSavedSearch(created.id, testUserId);
      expect(deleted).toBe(true);

      const listAfter = await getSavedSearches(testUserId);
      expect(listAfter.some((s) => s.id === created.id)).toBe(false);
    });
  });

  describe("Favourite Routes", () => {
    it("creates, retrieves, and removes favourite routes", async () => {
      const created = await createFavouriteRoute({
        userId: testUserId,
        fromIata: "BOM",
        toIata: "GOI",
        fromCity: "Mumbai",
        toCity: "Goa",
      });

      expect(created.id).toBeDefined();
      expect(created.fromIata).toBe("BOM");

      const routes = await getFavouriteRoutes(testUserId);
      expect(routes.some((r) => r.id === created.id)).toBe(true);

      const deleted = await deleteFavouriteRoute(created.id, testUserId);
      expect(deleted).toBe(true);
    });
  });

  describe("Bookings", () => {
    it("persists and retrieves booking history records", async () => {
      const booking = await createBooking({
        userId: testUserId,
        bookingReference: "AB-TEST01",
        pnr: "6E-TEST1",
        carrierCode: "6E",
        carrierName: "IndiGo",
        flightNumber: "6E-551",
        origin: "DEL",
        destination: "BOM",
        departureTime: "2026-11-20T06:00:00",
        arrivalTime: "2026-11-20T08:15:00",
        passengers: [
          {
            id: "pax-1",
            type: "adult",
            title: "Mr",
            firstName: "Test",
            lastName: "Traveller",
            gender: "male",
          },
        ],
        contactEmail: "test@aerobook.in",
        contactPhone: "+91 9999999999",
        totalAmount: 4500,
        currency: "INR",
        status: "confirmed",
      });

      expect(booking.id).toBeDefined();
      expect(booking.bookingReference).toBe("AB-TEST01");

      const userBookings = await getBookings(testUserId);
      expect(userBookings.some((b) => b.bookingReference === "AB-TEST01")).toBe(true);

      const lookup = await getBookingByReference("AB-TEST01");
      expect(lookup).not.toBeNull();
      expect(lookup?.carrierName).toBe("IndiGo");
    });
  });
});

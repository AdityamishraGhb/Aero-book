import type {
  SavedSearch,
  NewSavedSearch,
  FavouriteRoute,
  NewFavouriteRoute,
  Booking,
  NewBooking,
  User,
} from "./schema";

/**
 * In-memory fallback database for local development and CI testing
 * when DATABASE_URL is not set.
 */
class InMemoryDatabase {
  private users = new Map<string, User>();
  private savedSearches = new Map<string, SavedSearch>();
  private favouriteRoutes = new Map<string, FavouriteRoute>();
  private bookings = new Map<string, Booking>();

  constructor() {
    // Seed default demo user
    const demoUser: User = {
      id: "usr-demo-1",
      name: "Aditya Mishra",
      email: "aditya@aerobook.in",
      emailVerified: new Date(),
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed a couple of default saved searches for demo
    const search1: SavedSearch = {
      id: "search-1",
      userId: demoUser.id,
      fromIata: "DEL",
      toIata: "BOM",
      fromCity: "New Delhi",
      toCity: "Mumbai",
      departDate: "2026-11-20",
      returnDate: null,
      trip: "oneway",
      passengers: 1,
      cabin: "economy",
      createdAt: new Date(Date.now() - 3600000 * 24),
    };
    this.savedSearches.set(search1.id, search1);

    // Seed a favourite route
    const fav1: FavouriteRoute = {
      id: "fav-1",
      userId: demoUser.id,
      fromIata: "DEL",
      toIata: "BOM",
      fromCity: "New Delhi",
      toCity: "Mumbai",
      createdAt: new Date(Date.now() - 3600000 * 48),
    };
    this.favouriteRoutes.set(fav1.id, fav1);

    // Seed a past booking
    const booking1: Booking = {
      id: "book-1",
      userId: demoUser.id,
      bookingReference: "AB-78K29P",
      pnr: "6E-59821",
      carrierCode: "6E",
      carrierName: "IndiGo",
      flightNumber: "6E-204",
      origin: "DEL",
      destination: "BOM",
      departureTime: "2026-11-20T06:00:00",
      arrivalTime: "2026-11-20T08:15:00",
      passengers: [
        {
          id: "pax-1",
          type: "adult",
          title: "Mr",
          firstName: "Aditya",
          lastName: "Mishra",
          gender: "male",
        },
      ],
      contactEmail: "aditya@aerobook.in",
      contactPhone: "+91 9876543210",
      totalAmount: 4299,
      currency: "INR",
      status: "confirmed",
      createdAt: new Date(Date.now() - 3600000 * 12),
    };
    this.bookings.set(booking1.id, booking1);
  }

  // --- Users ---
  getUserByEmail(email: string): User | null {
    for (const u of this.users.values()) {
      if (u.email?.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  createUser(user: Partial<User> & { email: string }): User {
    const newUser: User = {
      id: user.id || `usr-${crypto.randomUUID()}`,
      name: user.name || user.email.split("@")[0],
      email: user.email,
      emailVerified: user.emailVerified || null,
      image: user.image || null,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  // --- Saved Searches ---
  getSavedSearches(userId: string): SavedSearch[] {
    return Array.from(this.savedSearches.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createSavedSearch(input: NewSavedSearch): SavedSearch {
    const record: SavedSearch = {
      id: input.id || `search-${crypto.randomUUID()}`,
      userId: input.userId,
      fromIata: input.fromIata,
      toIata: input.toIata,
      fromCity: input.fromCity,
      toCity: input.toCity,
      departDate: input.departDate,
      returnDate: input.returnDate || null,
      trip: input.trip || "oneway",
      passengers: input.passengers ?? 1,
      cabin: input.cabin || "economy",
      createdAt: new Date(),
    };
    this.savedSearches.set(record.id, record);
    return record;
  }

  deleteSavedSearch(id: string, userId: string): boolean {
    const item = this.savedSearches.get(id);
    if (item && item.userId === userId) {
      this.savedSearches.delete(id);
      return true;
    }
    return false;
  }

  // --- Favourite Routes ---
  getFavouriteRoutes(userId: string): FavouriteRoute[] {
    return Array.from(this.favouriteRoutes.values())
      .filter((f) => f.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createFavouriteRoute(input: NewFavouriteRoute): FavouriteRoute {
    // Check if already favorited
    for (const f of this.favouriteRoutes.values()) {
      if (f.userId === input.userId && f.fromIata === input.fromIata && f.toIata === input.toIata) {
        return f;
      }
    }

    const record: FavouriteRoute = {
      id: input.id || `fav-${crypto.randomUUID()}`,
      userId: input.userId,
      fromIata: input.fromIata,
      toIata: input.toIata,
      fromCity: input.fromCity,
      toCity: input.toCity,
      createdAt: new Date(),
    };
    this.favouriteRoutes.set(record.id, record);
    return record;
  }

  deleteFavouriteRoute(id: string, userId: string): boolean {
    const item = this.favouriteRoutes.get(id);
    if (item && item.userId === userId) {
      this.favouriteRoutes.delete(id);
      return true;
    }
    return false;
  }

  // --- Bookings ---
  getBookings(userId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getBookingByReference(reference: string): Booking | null {
    for (const b of this.bookings.values()) {
      if (b.bookingReference.toUpperCase() === reference.toUpperCase()) {
        return b;
      }
    }
    return null;
  }

  createBooking(input: NewBooking): Booking {
    const record: Booking = {
      id: input.id || `book-${crypto.randomUUID()}`,
      userId: input.userId || null,
      bookingReference: input.bookingReference,
      pnr: input.pnr,
      carrierCode: input.carrierCode,
      carrierName: input.carrierName,
      flightNumber: input.flightNumber,
      origin: input.origin,
      destination: input.destination,
      departureTime: input.departureTime,
      arrivalTime: input.arrivalTime,
      passengers: input.passengers,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      totalAmount: input.totalAmount,
      currency: input.currency || "INR",
      status: input.status || "confirmed",
      createdAt: new Date(),
    };
    this.bookings.set(record.id, record);
    return record;
  }
}

export const memoryDb = new InMemoryDatabase();

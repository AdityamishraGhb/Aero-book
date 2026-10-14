import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc, and } from "drizzle-orm";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { memoryDb } from "./memory-fallback";
import type {
  SavedSearch,
  NewSavedSearch,
  FavouriteRoute,
  NewFavouriteRoute,
  Booking,
  NewBooking,
  User,
} from "./schema";

const isDatabaseConfigured = Boolean(env.DATABASE_URL);

// Initialize Drizzle with Neon HTTP connection if DATABASE_URL is configured
export const db = isDatabaseConfigured ? drizzle(neon(env.DATABASE_URL), { schema }) : null;

export const isDbConnected = isDatabaseConfigured;

// ==============================================================================
// High-Level Data Access Operations (PostgreSQL with Memory Fallback)
// ==============================================================================

export async function getUserByEmail(email: string): Promise<User | null> {
  if (db) {
    try {
      const results = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      return results[0] || null;
    } catch {
      // Fallback
    }
  }
  return memoryDb.getUserByEmail(email);
}

export async function getUserById(id: string): Promise<User | null> {
  if (db) {
    try {
      const results = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
      return results[0] || null;
    } catch {
      // Fallback
    }
  }
  return memoryDb.getUserById(id);
}

export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  if (db) {
    try {
      return await db
        .select()
        .from(schema.savedSearches)
        .where(eq(schema.savedSearches.userId, userId))
        .orderBy(desc(schema.savedSearches.createdAt));
    } catch {
      // Fallback
    }
  }
  return memoryDb.getSavedSearches(userId);
}

export async function createSavedSearch(input: NewSavedSearch): Promise<SavedSearch> {
  if (db) {
    try {
      const results = await db.insert(schema.savedSearches).values(input).returning();
      if (results[0]) return results[0];
    } catch {
      // Fallback
    }
  }
  return memoryDb.createSavedSearch(input);
}

export async function deleteSavedSearch(id: string, userId: string): Promise<boolean> {
  if (db) {
    try {
      const res = await db
        .delete(schema.savedSearches)
        .where(and(eq(schema.savedSearches.id, id), eq(schema.savedSearches.userId, userId)));
      return Boolean(res);
    } catch {
      // Fallback
    }
  }
  return memoryDb.deleteSavedSearch(id, userId);
}

export async function getFavouriteRoutes(userId: string): Promise<FavouriteRoute[]> {
  if (db) {
    try {
      return await db
        .select()
        .from(schema.favouriteRoutes)
        .where(eq(schema.favouriteRoutes.userId, userId))
        .orderBy(desc(schema.favouriteRoutes.createdAt));
    } catch {
      // Fallback
    }
  }
  return memoryDb.getFavouriteRoutes(userId);
}

export async function createFavouriteRoute(input: NewFavouriteRoute): Promise<FavouriteRoute> {
  if (db) {
    try {
      const results = await db.insert(schema.favouriteRoutes).values(input).returning();
      if (results[0]) return results[0];
    } catch {
      // Fallback
    }
  }
  return memoryDb.createFavouriteRoute(input);
}

export async function deleteFavouriteRoute(id: string, userId: string): Promise<boolean> {
  if (db) {
    try {
      const res = await db
        .delete(schema.favouriteRoutes)
        .where(and(eq(schema.favouriteRoutes.id, id), eq(schema.favouriteRoutes.userId, userId)));
      return Boolean(res);
    } catch {
      // Fallback
    }
  }
  return memoryDb.deleteFavouriteRoute(id, userId);
}

export async function getBookings(userId: string): Promise<Booking[]> {
  if (db) {
    try {
      return await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.userId, userId))
        .orderBy(desc(schema.bookings.createdAt));
    } catch {
      // Fallback
    }
  }
  return memoryDb.getBookings(userId);
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  if (db) {
    try {
      const results = await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.bookingReference, reference))
        .limit(1);
      return results[0] || null;
    } catch {
      // Fallback
    }
  }
  return memoryDb.getBookingByReference(reference);
}

export async function createBooking(input: NewBooking): Promise<Booking> {
  if (db) {
    try {
      const results = await db.insert(schema.bookings).values(input).returning();
      if (results[0]) return results[0];
    } catch {
      // Fallback
    }
  }
  return memoryDb.createBooking(input);
}

export * from "./schema";
export { memoryDb };

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Search Results",
  description:
    "Compare live flight deals, filter by airline, stops, and price, and book flights with zero hidden fees on AeroBook.",
};

export default function FlightRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { ImageResponse } from "next/og";
import { getTopRouteBySlug, TOP_INDIAN_ROUTES } from "@/data/top-routes";

export const alt = "AeroBook Route Fares";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function generateStaticParams() {
  return TOP_INDIAN_ROUTES.map((route) => ({
    route: route.slug,
  }));
}

export default async function Image({ params }: { params: Promise<{ route: string }> }) {
  const { route: routeSlug } = await params;
  const route = getTopRouteBySlug(routeSlug) || TOP_INDIAN_ROUTES[0];

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0B1515",
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(14, 124, 123, 0.4) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(247, 160, 114, 0.25) 0%, transparent 60%)",
        padding: "60px 80px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#0E7C7B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>
          <span style={{ fontSize: "30px", fontWeight: "800" }}>AeroBook</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: "999px",
            backgroundColor: "rgba(14, 124, 123, 0.25)",
            border: "1px solid rgba(14, 124, 123, 0.6)",
            color: "#38C5B9",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          Direct Domestic Corridor
        </div>
      </div>

      {/* Route Corridor Display */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "68px",
                fontWeight: "900",
                letterSpacing: "-2px",
                color: "#FFFFFF",
              }}
            >
              {route.fromIata}
            </span>
            <span style={{ fontSize: "20px", color: "#9CB3B0", fontWeight: "600" }}>
              {route.fromCity}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "0 10px" }}>
            <div
              style={{ display: "flex", width: "80px", height: "3px", backgroundColor: "#0E7C7B" }}
            />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#F7A072">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <div
              style={{ display: "flex", width: "80px", height: "3px", backgroundColor: "#0E7C7B" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "68px",
                fontWeight: "900",
                letterSpacing: "-2px",
                color: "#FFFFFF",
              }}
            >
              {route.toIata}
            </span>
            <span style={{ fontSize: "20px", color: "#9CB3B0", fontWeight: "600" }}>
              {route.toCity}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "22px", color: "#CAD8D5" }}>
          Direct flights from {route.fromCity} to {route.toCity} • Average flight time{" "}
          {route.averageDuration}
        </div>
      </div>

      {/* Bottom Route Metrics Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "20px 32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#8EABA7",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Fares Starting At
          </span>
          <span style={{ fontSize: "32px", fontWeight: "900", color: "#F7A072" }}>
            ₹{route.startingFare.toLocaleString("en-IN")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#8EABA7",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Daily Flights
          </span>
          <span style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF" }}>
            {route.dailyFlightsCount}+ Non-Stops
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#8EABA7",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Distance
          </span>
          <span style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF" }}>
            {route.distanceKm} km
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#8EABA7",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Top Carriers
          </span>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#38C5B9" }}>
            {route.popularAirlines.slice(0, 3).join(", ")}
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}

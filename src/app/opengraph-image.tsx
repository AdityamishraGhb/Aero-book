import { ImageResponse } from "next/og";

export const alt = "AeroBook — Your Next Journey, Simplified.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0B1F2D",
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(212, 160, 23, 0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(11, 31, 45, 0.9) 0%, transparent 60%)",
        padding: "70px 80px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#FFFFFF",
      }}
    >
      {/* Top Logo & Brand Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#D4A017",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(212, 160, 23, 0.4)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0B1F2D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: "36px", fontWeight: "800", letterSpacing: "-1px" }}>
            <span>Aero</span>
            <span style={{ color: "#D4A017" }}>Book</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 22px",
            borderRadius: "999px",
            backgroundColor: "rgba(212, 160, 23, 0.15)",
            border: "1px solid rgba(212, 160, 23, 0.4)",
            color: "#D4A017",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          ✈ FLIGHTS • HOTELS • MORE
        </div>
      </div>

      {/* Hero Headline & Subhead */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "64px",
            fontWeight: "900",
            lineHeight: "1.1",
            letterSpacing: "-2px",
            color: "#FFFFFF",
          }}
        >
          <span>Your Next Journey,&nbsp;</span>
          <span style={{ color: "#D4A017" }}>Simplified.</span>
        </div>
        <div style={{ display: "flex", fontSize: "24px", color: "#6B7280", lineHeight: "1.4", fontWeight: "400" }}>
          Smarter searches. Better deals. Unbiased airfares, live multi-currency, zero hidden fees, and instant transparent booking.
        </div>
      </div>

      {/* Bottom Feature Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            color: "#E0ECE9",
            fontWeight: "600",
          }}
        >
          <span style={{ color: "#F7A072" }}>●</span> Top 20 Indian Corridors
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            color: "#E0ECE9",
            fontWeight: "600",
          }}
        >
          <span style={{ color: "#0E7C7B" }}>●</span> Live Fare Tracking
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            color: "#E0ECE9",
            fontWeight: "600",
          }}
        >
          <span style={{ color: "#38C5B9" }}>●</span> Instant DigiYatra & Terminal Info
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}

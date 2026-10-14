import type { Metadata } from "next";
import { getAirportByIata } from "@/data/airports";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route: routeParam } = await params;
  const [from = "DEL", to = "BOM"] = routeParam.toUpperCase().split("-");
  const origin = getAirportByIata(from);
  const dest = getAirportByIata(to);

  const fromLabel = origin?.city || from;
  const toLabel = dest?.city || to;

  const title = `Flights from ${fromLabel} to ${toLabel} (${from} to ${to}) | AeroBook`;
  const description = `Compare live flight deals and fares from ${fromLabel} (${from}) to ${toLabel} (${to}). Filter by airline, stops, departure time, and score.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function FlightRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

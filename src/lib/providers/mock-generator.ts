import type {
  Airport,
  FlightOffer,
  FlightSearchQuery,
  FlightSegment,
  FlightSlice,
} from "@/types/flight";
import { getAirportByIata } from "@/data/airports";

/**
 * Seeded PRNG using mulberry32 algorithm for deterministic reproducibility
 */
function createPrng(seedStr: string): () => number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
  }

  let state = hash >>> 0;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Great-circle distance between two coordinates in kilometers (Haversine formula)
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

interface CarrierDef {
  code: string;
  name: string;
  aircrafts: string[];
  domesticOnly?: boolean;
  intlOnly?: boolean;
}

const CARRIERS: CarrierDef[] = [
  // Major Indian carriers
  {
    code: "6E",
    name: "IndiGo",
    aircrafts: ["Airbus A320neo", "Airbus A321neo", "Boeing 777-300ER"],
  },
  {
    code: "AI",
    name: "Air India",
    aircrafts: ["Airbus A320neo", "Airbus A350-900", "Boeing 787-8 Dreamliner", "Boeing 777-300ER"],
  },
  { code: "UK", name: "Vistara", aircrafts: ["Airbus A321neo", "Boeing 787-9 Dreamliner"] },
  { code: "QP", name: "Akasa Air", aircrafts: ["Boeing 737 MAX 8"], domesticOnly: true },
  { code: "SG", name: "SpiceJet", aircrafts: ["Boeing 737-800", "Q400"], domesticOnly: true },
  { code: "IX", name: "Air India Express", aircrafts: ["Boeing 737 MAX 8", "Airbus A320neo"] },

  // Leading International Carriers
  {
    code: "EK",
    name: "Emirates",
    aircrafts: ["Airbus A380-800", "Boeing 777-300ER"],
    intlOnly: true,
  },
  {
    code: "QR",
    name: "Qatar Airways",
    aircrafts: ["Airbus A350-1000", "Boeing 787-9 Dreamliner"],
    intlOnly: true,
  },
  {
    code: "SQ",
    name: "Singapore Airlines",
    aircrafts: ["Airbus A350-900", "Boeing 787-10"],
    intlOnly: true,
  },
  {
    code: "BA",
    name: "British Airways",
    aircrafts: ["Boeing 777-200", "Airbus A350-1000"],
    intlOnly: true,
  },
  { code: "LH", name: "Lufthansa", aircrafts: ["Airbus A350-900", "Boeing 747-8"], intlOnly: true },
  {
    code: "EY",
    name: "Etihad Airways",
    aircrafts: ["Boeing 787-9", "Airbus A350-1000"],
    intlOnly: true,
  },
  {
    code: "TG",
    name: "Thai Airways",
    aircrafts: ["Airbus A350-900", "Boeing 777-300ER"],
    intlOnly: true,
  },
];

/**
 * Determine connecting layover hubs based on origin/dest
 */
function getPotentialHubs(from: Airport, to: Airport): string[] {
  const isDomesticIndia = from.countryCode === "IN" && to.countryCode === "IN";
  if (isDomesticIndia) {
    return ["BOM", "DEL", "BLR", "HYD"].filter((h) => h !== from.iata && h !== to.iata);
  }

  // International hubs
  const intlHubs = ["DXB", "DOH", "SIN", "BKK", "DEL", "BOM", "LHR", "FRA"];
  return intlHubs.filter((h) => h !== from.iata && h !== to.iata);
}

/**
 * Deterministically generate flight offers for given query
 */
export function generateMockFlights(
  query: FlightSearchQuery,
  originAirport: Airport,
  destinationAirport: Airport
): FlightOffer[] {
  const seedKey = `${query.from}-${query.to}-${query.depart}-${query.return || ""}-${query.cabin}-${query.adults}-${query.directOnly ? "direct" : "all"}`;
  const prng = createPrng(seedKey);

  const distanceKm = calculateDistanceKm(
    originAirport.lat,
    originAirport.lon,
    destinationAirport.lat,
    destinationAirport.lon
  );

  const isDomestic = originAirport.countryCode === "IN" && destinationAirport.countryCode === "IN";

  // Filter carriers suitable for this corridor
  const eligibleCarriers = CARRIERS.filter((c) => {
    if (isDomestic && c.intlOnly) return false;
    if (!isDomestic && c.domesticOnly) return false;
    return true;
  });

  // Base flight duration estimate in minutes: (distance / 780km/h) * 60 + 30m climb/taxi
  const rawFlightTime = Math.round(30 + (distanceKm / 780) * 60);
  const minDirectDuration = Math.max(50, rawFlightTime);

  // Generate 8 to 16 realistic offers
  const offerCount = Math.floor(prng() * 9) + 8;
  const rawOffers: FlightOffer[] = [];

  const candidateHubs = getPotentialHubs(originAirport, destinationAirport);

  for (let i = 0; i < offerCount; i++) {
    const carrier = eligibleCarriers[Math.floor(prng() * eligibleCarriers.length)];
    const aircraft = carrier.aircrafts[Math.floor(prng() * carrier.aircrafts.length)];

    // Flight number
    const flightNum = `${carrier.code}-${Math.floor(prng() * 800) + 100}`;

    // Decide stops (direct vs 1-stop)
    let stops = 0;
    if (!query.directOnly && distanceKm > 350) {
      // 40% probability of 1 stop if not forced direct
      if (prng() < 0.45 && candidateHubs.length > 0) {
        stops = 1;
      }
    }

    // Departure time spread (between 05:00 and 22:45)
    const depHour = Math.floor(prng() * 18) + 5;
    const depMinute = Math.floor(prng() * 12) * 5;
    const depTimeStr = `${String(depHour).padStart(2, "0")}:${String(depMinute).padStart(2, "0")}`;

    const outboundDepartureIso = `${query.depart}T${depTimeStr}:00`;

    // Slices construction
    const outboundSegments: FlightSegment[] = [];
    let outboundTotalDuration = 0;

    if (stops === 0) {
      const flightDuration = minDirectDuration + Math.floor((prng() - 0.5) * 20);
      outboundTotalDuration = Math.max(45, flightDuration);

      const arrDate = new Date(`${outboundDepartureIso}Z`);
      arrDate.setUTCMinutes(arrDate.getUTCMinutes() + outboundTotalDuration);
      const arrIso = arrDate.toISOString().slice(0, 19);

      outboundSegments.push({
        id: `seg-out-${i}-1`,
        carrierCode: carrier.code,
        carrierName: carrier.name,
        flightNumber: flightNum,
        aircraft,
        departureAirport: originAirport.iata,
        departureTerminal: prng() > 0.4 ? "T2" : "T3",
        departureTime: outboundDepartureIso,
        arrivalAirport: destinationAirport.iata,
        arrivalTerminal: prng() > 0.4 ? "T2" : "T1",
        arrivalTime: arrIso,
        durationMinutes: outboundTotalDuration,
        cabin: query.cabin.charAt(0).toUpperCase() + query.cabin.slice(1),
      });
    } else {
      // 1 stop via hub
      const hubCode = candidateHubs[Math.floor(prng() * candidateHubs.length)];
      const hubAirport = getAirportByIata(hubCode);

      const leg1Km = hubAirport
        ? calculateDistanceKm(originAirport.lat, originAirport.lon, hubAirport.lat, hubAirport.lon)
        : Math.round(distanceKm * 0.5);
      const leg2Km = hubAirport
        ? calculateDistanceKm(
            hubAirport.lat,
            hubAirport.lon,
            destinationAirport.lat,
            destinationAirport.lon
          )
        : Math.round(distanceKm * 0.6);

      const leg1Duration = Math.max(45, Math.round(25 + (leg1Km / 780) * 60));
      const layoverMinutes = Math.floor(prng() * 90) + 60; // 60m to 150m layover
      const leg2Duration = Math.max(45, Math.round(25 + (leg2Km / 780) * 60));

      outboundTotalDuration = leg1Duration + layoverMinutes + leg2Duration;

      // Leg 1
      const leg1Dep = outboundDepartureIso;
      const leg1ArrDate = new Date(`${leg1Dep}Z`);
      leg1ArrDate.setUTCMinutes(leg1ArrDate.getUTCMinutes() + leg1Duration);
      const leg1Arr = leg1ArrDate.toISOString().slice(0, 19);

      // Leg 2
      const leg2DepDate = new Date(`${leg1Arr}Z`);
      leg2DepDate.setUTCMinutes(leg2DepDate.getUTCMinutes() + layoverMinutes);
      const leg2Dep = leg2DepDate.toISOString().slice(0, 19);

      const leg2ArrDate = new Date(`${leg2Dep}Z`);
      leg2ArrDate.setUTCMinutes(leg2ArrDate.getUTCMinutes() + leg2Duration);
      const leg2Arr = leg2ArrDate.toISOString().slice(0, 19);

      outboundSegments.push({
        id: `seg-out-${i}-1`,
        carrierCode: carrier.code,
        carrierName: carrier.name,
        flightNumber: flightNum,
        aircraft,
        departureAirport: originAirport.iata,
        departureTerminal: "T3",
        departureTime: leg1Dep,
        arrivalAirport: hubCode,
        arrivalTerminal: "T2",
        arrivalTime: leg1Arr,
        durationMinutes: leg1Duration,
        layoverMinutes,
        cabin: query.cabin.charAt(0).toUpperCase() + query.cabin.slice(1),
      });

      outboundSegments.push({
        id: `seg-out-${i}-2`,
        carrierCode: carrier.code,
        carrierName: carrier.name,
        flightNumber: `${carrier.code}-${Math.floor(prng() * 800) + 200}`,
        aircraft,
        departureAirport: hubCode,
        departureTerminal: "T2",
        departureTime: leg2Dep,
        arrivalAirport: destinationAirport.iata,
        arrivalTerminal: "T1",
        arrivalTime: leg2Arr,
        durationMinutes: leg2Duration,
        cabin: query.cabin.charAt(0).toUpperCase() + query.cabin.slice(1),
      });
    }

    const outboundSlice: FlightSlice = {
      durationMinutes: outboundTotalDuration,
      stops,
      departureAirport: originAirport.iata,
      departureTime: outboundDepartureIso,
      arrivalAirport: destinationAirport.iata,
      arrivalTime: outboundSegments[outboundSegments.length - 1].arrivalTime,
      segments: outboundSegments,
    };

    const slices: FlightSlice[] = [outboundSlice];

    // If round-trip requested, generate return slice
    if (query.trip === "roundtrip" && query.return) {
      const returnDepHour = Math.floor(prng() * 16) + 6;
      const returnDepMinute = Math.floor(prng() * 12) * 5;
      const returnDepTimeStr = `${String(returnDepHour).padStart(2, "0")}:${String(returnDepMinute).padStart(2, "0")}`;
      const returnDepIso = `${query.return}T${returnDepTimeStr}:00`;

      const returnArrDate = new Date(`${returnDepIso}Z`);
      returnArrDate.setUTCMinutes(returnArrDate.getUTCMinutes() + outboundTotalDuration);
      const returnArrIso = returnArrDate.toISOString().slice(0, 19);

      slices.push({
        durationMinutes: outboundTotalDuration,
        stops,
        departureAirport: destinationAirport.iata,
        departureTime: returnDepIso,
        arrivalAirport: originAirport.iata,
        arrivalTime: returnArrIso,
        segments: [
          {
            id: `seg-ret-${i}-1`,
            carrierCode: carrier.code,
            carrierName: carrier.name,
            flightNumber: `${carrier.code}-${Math.floor(prng() * 800) + 500}`,
            aircraft,
            departureAirport: destinationAirport.iata,
            departureTerminal: "T2",
            departureTime: returnDepIso,
            arrivalAirport: originAirport.iata,
            arrivalTerminal: "T3",
            arrivalTime: returnArrIso,
            durationMinutes: outboundTotalDuration,
            cabin: query.cabin.charAt(0).toUpperCase() + query.cabin.slice(1),
          },
        ],
      });
    }

    // Realistic Pricing in INR
    // Domestic: ₹3.6 - ₹5.4 per km + airport tax ₹650
    // International: ₹5.2 - ₹8.0 per km + tax ₹2,400
    const ratePerKm = isDomestic ? 3.6 + prng() * 1.8 : 5.2 + prng() * 2.8;

    let baseFare = Math.round(Math.max(2800, distanceKm * ratePerKm));
    let taxes = Math.round(isDomestic ? 650 + baseFare * 0.05 : 2400 + baseFare * 0.12);

    // Stops discount (connecting flights are often slightly cheaper)
    if (stops > 0) {
      baseFare = Math.round(baseFare * 0.88);
    }

    // Cabin class multiplier
    const cabinMultiplier = {
      economy: 1.0,
      "premium-economy": 1.75,
      business: 3.2,
      first: 5.8,
    }[query.cabin];

    baseFare = Math.round(baseFare * cabinMultiplier);
    taxes = Math.round(taxes * (1 + (cabinMultiplier - 1) * 0.4));

    // If round-trip, double fare with slight return discount
    if (query.trip === "roundtrip") {
      baseFare = Math.round(baseFare * 1.88);
      taxes = Math.round(taxes * 1.9);
    }

    // Passengers calculation
    const totalAdults = query.adults;
    const totalChildren = query.children;
    const totalInfants = query.infants;

    const passengerFactor = totalAdults + totalChildren * 0.75 + totalInfants * 0.15;
    const totalBaseFare = Math.round(baseFare * passengerFactor);
    const totalTaxes = Math.round(taxes * (totalAdults + totalChildren));
    const totalAmount = totalBaseFare + totalTaxes;

    // Remaining seats
    const seatsRemaining = Math.floor(prng() * 7) + 2;

    // Baggage policy
    const baggage =
      query.cabin === "business" || query.cabin === "first"
        ? { cabin: "12 kg (2 pieces)", checked: "35 kg included" }
        : isDomestic
          ? { cabin: "7 kg", checked: "15 kg included" }
          : { cabin: "7 kg", checked: "23 kg (1 piece)" };

    // Amenities
    const amenities: string[] = ["Free check-in", "E-boarding pass"];
    if (carrier.code === "UK" || carrier.code === "AI" || carrier.code === "EK") {
      amenities.push("Complimentary Hot Meal");
    }
    if (aircraft.includes("Dreamliner") || aircraft.includes("A350")) {
      amenities.push("Seatback USB & Entertainment");
    }

    rawOffers.push({
      id: `offer-${query.from}${query.to}-${i + 1}`,
      provider: "mock",
      slices,
      price: {
        amount: totalAmount,
        currency: "INR",
        baseFare: totalBaseFare,
        taxes: totalTaxes,
      },
      scoring: {
        bestScore: 8.5, // Computed in next step relative to set
        priceScore: 8.5,
        durationScore: 8.5,
      },
      cabin: query.cabin,
      seatsRemaining,
      baggage,
      amenities,
      bookingUrl: `/flights/${query.from}-${query.to}/offer-${query.from}${query.to}-${i + 1}?depart=${query.depart}&trip=${query.trip}&adults=${query.adults}&cabin=${query.cabin}`,
    });
  }

  // Calculate composite "Best Score" relative to the dataset
  if (rawOffers.length > 0) {
    const prices = rawOffers.map((o) => o.price.amount);
    const durations = rawOffers.map((o) => o.slices[0].durationMinutes);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    const priceDelta = maxPrice - minPrice || 1;
    const durationDelta = maxDuration - minDuration || 1;

    for (const offer of rawOffers) {
      const priceRatio = (offer.price.amount - minPrice) / priceDelta;
      const durationRatio = (offer.slices[0].durationMinutes - minDuration) / durationDelta;
      const stopPenalty = offer.slices[0].stops * 1.5;

      // Price is 45% weight, Duration is 40% weight, Stops penalty 15%
      const priceScore = Math.max(1, 10 - priceRatio * 7);
      const durationScore = Math.max(1, 10 - durationRatio * 6);

      let bestScore = 10 - priceRatio * 3.5 - durationRatio * 3.5 - stopPenalty;
      bestScore = Math.min(9.8, Math.max(4.2, Math.round(bestScore * 10) / 10));

      offer.scoring = {
        bestScore,
        priceScore: Math.round(priceScore * 10) / 10,
        durationScore: Math.round(durationScore * 10) / 10,
      };
    }
  }

  // Sort offers according to query.sort
  if (query.sort === "cheapest") {
    rawOffers.sort((a, b) => a.price.amount - b.price.amount);
  } else if (query.sort === "fastest") {
    rawOffers.sort((a, b) => a.slices[0].durationMinutes - b.slices[0].durationMinutes);
  } else if (query.sort === "departure") {
    rawOffers.sort((a, b) => a.slices[0].departureTime.localeCompare(b.slices[0].departureTime));
  } else {
    // "best" composite scoring
    rawOffers.sort((a, b) => b.scoring.bestScore - a.scoring.bestScore);
  }

  return rawOffers;
}

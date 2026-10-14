"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plane,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Luggage,
  User,
  Mail,
  Phone,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  useBookingStore,
  type PassengerData,
  type ContactDetails,
} from "@/lib/store/booking-store";
import { findOfferById } from "@/lib/providers/offer-lookup";
import { getAirportByIata } from "@/data/airports";
import { formatCurrency, formatDuration, formatTime, formatDate } from "@/lib/format";
import type { FlightOffer } from "@/types/flight";

export default function BookingFlowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeOffer = useBookingStore((s) => s.selectedOffer);
  const storePassengers = useBookingStore((s) => s.passengers);
  const storeContact = useBookingStore((s) => s.contact);
  const setSelectedOffer = useBookingStore((s) => s.setSelectedOffer);
  const setStorePassengers = useBookingStore((s) => s.setPassengers);
  const setStoreContact = useBookingStore((s) => s.setContactDetails);
  const completeBooking = useBookingStore((s) => s.completeBooking);

  // Current step: 1 = Passengers & Contact, 2 = Review & Mock Payment
  const [step, setStep] = React.useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Selected mock payment method in Step 2
  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "card" | "netbanking">("upi");
  const [termsAgreed, setTermsAgreed] = React.useState(true);

  // Parse query params for fallback offer lookup
  const offerIdParam = searchParams.get("offerId");
  const fromParam = searchParams.get("from") || "DEL";
  const toParam = searchParams.get("to") || "BOM";
  const departParam = searchParams.get("depart") || "2026-11-20";
  const returnParam = searchParams.get("return") || undefined;
  const tripParam = (searchParams.get("trip") as "oneway" | "roundtrip") || "oneway";
  const adultsParam = Math.max(1, Number(searchParams.get("adults")) || 1);
  const childrenParam = Math.max(0, Number(searchParams.get("children")) || 0);
  const infantsParam = Math.max(0, Number(searchParams.get("infants")) || 0);
  const cabinParam =
    (searchParams.get("cabin") as "economy" | "premium-economy" | "business" | "first") ||
    "economy";

  // Resolve active offer either from store or URL lookup
  const activeOffer: FlightOffer | null = React.useMemo(() => {
    if (storeOffer) return storeOffer;
    if (offerIdParam) {
      return findOfferById(offerIdParam, {
        from: fromParam,
        to: toParam,
        depart: departParam,
        return: returnParam,
        trip: tripParam,
        adults: adultsParam,
        children: childrenParam,
        infants: infantsParam,
        cabin: cabinParam,
        directOnly: false,
        currency: "INR",
        sort: "best",
      });
    }
    return null;
  }, [
    storeOffer,
    offerIdParam,
    fromParam,
    toParam,
    departParam,
    returnParam,
    tripParam,
    adultsParam,
    childrenParam,
    infantsParam,
    cabinParam,
  ]);

  // Synchronize active offer to store if recovered via URL
  React.useEffect(() => {
    if (activeOffer && !storeOffer) {
      setSelectedOffer(activeOffer);
    }
  }, [activeOffer, storeOffer, setSelectedOffer]);

  // Initialize passenger list
  const [passengers, setPassengers] = React.useState<PassengerData[]>(() => {
    if (storePassengers.length > 0) return storePassengers;

    const list: PassengerData[] = [];
    let paxIndex = 1;

    for (let i = 0; i < adultsParam; i++) {
      list.push({
        id: `pax-${paxIndex++}`,
        type: "adult",
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "male",
      });
    }
    for (let i = 0; i < childrenParam; i++) {
      list.push({
        id: `pax-${paxIndex++}`,
        type: "child",
        title: "Master",
        firstName: "",
        lastName: "",
        gender: "male",
      });
    }
    for (let i = 0; i < infantsParam; i++) {
      list.push({
        id: `pax-${paxIndex++}`,
        type: "infant",
        title: "Master",
        firstName: "",
        lastName: "",
        gender: "male",
      });
    }

    if (list.length === 0) {
      list.push({
        id: "pax-1",
        type: "adult",
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "male",
      });
    }

    return list;
  });

  // Contact form state
  const [contact, setContact] = React.useState<ContactDetails>(() => {
    return (
      storeContact || {
        email: "",
        phone: "",
        countryCode: "+91",
      }
    );
  });

  // Form errors
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Update specific passenger
  const handlePassengerChange = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Clear error for this field
    const errorKey = `pax_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // Update contact field
  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    const errorKey = `contact_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    passengers.forEach((pax, idx) => {
      if (!pax.firstName.trim()) {
        errs[`pax_${idx}_firstName`] = "First name is required";
      }
      if (!pax.lastName.trim()) {
        errs[`pax_${idx}_lastName`] = "Last name is required";
      }
    });

    if (!contact.email.trim()) {
      errs["contact_email"] = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      errs["contact_email"] = "Please enter a valid email";
    }

    if (!contact.phone.trim()) {
      errs["contact_phone"] = "Mobile phone number is required";
    } else if (contact.phone.trim().replace(/\D/g, "").length < 10) {
      errs["contact_phone"] = "Please enter a valid 10-digit phone number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 -> Step 2
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      // Scroll to top of errors
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setStorePassengers(passengers);
    setStoreContact(contact);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 Confirm & Complete Booking
  const handleConfirmBooking = async () => {
    if (!termsAgreed) {
      alert("Please agree to the booking terms and conditions to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Short delay for realistic reservation simulation
      await new Promise((resolve) => setTimeout(resolve, 600));

      completeBooking();
      router.push("/booking/confirmation");
    } catch (err) {
      console.error("Booking completion failed:", err);
      setIsSubmitting(false);
    }
  };

  if (!activeOffer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          No Flight Selected For Booking
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please search for flights and select an itinerary to begin the reservation flow.
        </p>
        <Button asChild className="mt-6" variant="default">
          <Link href="/">Back to Search Flights</Link>
        </Button>
      </div>
    );
  }

  const originAirport = getAirportByIata(activeOffer.slices[0].departureAirport);
  const destAirport = getAirportByIata(activeOffer.slices[0].arrivalAirport);
  const firstSegment = activeOffer.slices[0].segments[0];

  return (
    <div className="flex-1 w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <Link
            href={`/flights/${activeOffer.slices[0].departureAirport}-${activeOffer.slices[0].arrivalAirport}/${activeOffer.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to offer details</span>
          </Link>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 1 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  step === 1
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span>Passenger Details</span>
            </div>

            <span className="h-0.5 w-6 bg-border" />

            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 2 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  step === 2
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </span>
              <span>Review & Pay</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Form / Review (8 cols) + Sticky Fare Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {step === 1 ? (
              /* STEP 1: PASSENGER & CONTACT FORM */
              <form onSubmit={handleProceedToReview} className="space-y-6">
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                    Passenger & Contact Information
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Please ensure names match exactly as stated on your government-issued photo ID.
                  </p>
                </div>

                {/* Passenger Cards */}
                <div className="space-y-5">
                  {passengers.map((pax, index) => {
                    const fnErr = errors[`pax_${index}_firstName`];
                    const lnErr = errors[`pax_${index}_lastName`];

                    return (
                      <Card key={pax.id} className="border-border shadow-xs">
                        <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 px-6 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm font-bold uppercase tracking-wide">
                              Passenger {index + 1} ({pax.type})
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="text-[11px] font-mono capitalize">
                            {pax.type}
                          </Badge>
                        </CardHeader>

                        <CardContent className="p-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            {/* Title */}
                            <div className="sm:col-span-3 space-y-1.5">
                              <label
                                htmlFor={`pax_${index}_title`}
                                className="text-xs font-semibold text-foreground"
                              >
                                Title *
                              </label>
                              <select
                                id={`pax_${index}_title`}
                                value={pax.title}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "title",
                                    e.target.value as PassengerData["title"]
                                  )
                                }
                                className="flex h-9 w-full rounded-lg border border-border bg-card px-3 py-1 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:border-primary"
                              >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Master">Master</option>
                                <option value="Miss">Miss</option>
                              </select>
                            </div>

                            {/* First & Middle Name */}
                            <div className="sm:col-span-5 space-y-1.5">
                              <label
                                htmlFor={`pax_${index}_firstName`}
                                className="text-xs font-semibold text-foreground"
                              >
                                First & Middle Name *
                              </label>
                              <Input
                                id={`pax_${index}_firstName`}
                                placeholder="e.g. Aditya"
                                value={pax.firstName}
                                onChange={(e) =>
                                  handlePassengerChange(index, "firstName", e.target.value)
                                }
                                error={!!fnErr}
                              />
                              {fnErr && (
                                <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>{fnErr}</span>
                                </p>
                              )}
                            </div>

                            {/* Last Name */}
                            <div className="sm:col-span-4 space-y-1.5">
                              <label
                                htmlFor={`pax_${index}_lastName`}
                                className="text-xs font-semibold text-foreground"
                              >
                                Last Name *
                              </label>
                              <Input
                                id={`pax_${index}_lastName`}
                                placeholder="e.g. Mishra"
                                value={pax.lastName}
                                onChange={(e) =>
                                  handlePassengerChange(index, "lastName", e.target.value)
                                }
                                error={!!lnErr}
                              />
                              {lnErr && (
                                <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>{lnErr}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Gender */}
                            <div className="space-y-1.5">
                              <label
                                htmlFor={`pax_${index}_gender`}
                                className="text-xs font-semibold text-foreground"
                              >
                                Gender
                              </label>
                              <select
                                id={`pax_${index}_gender`}
                                value={pax.gender}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "gender",
                                    e.target.value as PassengerData["gender"]
                                  )
                                }
                                className="flex h-9 w-full rounded-lg border border-border bg-card px-3 py-1 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:border-primary"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-1.5">
                              <label
                                htmlFor={`pax_${index}_dob`}
                                className="text-xs font-semibold text-foreground"
                              >
                                Date of Birth (Optional)
                              </label>
                              <Input
                                id={`pax_${index}_dob`}
                                type="date"
                                value={pax.dateOfBirth || ""}
                                onChange={(e) =>
                                  handlePassengerChange(index, "dateOfBirth", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Contact Information Card */}
                <Card className="border-border shadow-xs">
                  <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 px-6">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Contact Details (For E-Ticket & SMS Flight Alerts)</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Your booking confirmation and boarding pass will be dispatched to these
                      details.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact_email"
                          className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                        >
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Email Address *</span>
                        </label>
                        <Input
                          id="contact_email"
                          type="email"
                          placeholder="e.g. traveller@example.com"
                          value={contact.email}
                          onChange={(e) => handleContactChange("email", e.target.value)}
                          error={!!errors["contact_email"]}
                        />
                        {errors["contact_email"] && (
                          <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors["contact_email"]}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact_phone"
                          className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                        >
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Mobile Number *</span>
                        </label>
                        <div className="flex gap-2">
                          <span className="flex h-9 items-center justify-center rounded-lg border border-border bg-muted/50 px-3 text-xs font-semibold text-foreground font-mono">
                            +91
                          </span>
                          <Input
                            id="contact_phone"
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            value={contact.phone}
                            onChange={(e) => handleContactChange("phone", e.target.value)}
                            error={!!errors["contact_phone"]}
                          />
                        </div>
                        {errors["contact_phone"] && (
                          <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors["contact_phone"]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Continue CTA */}
                <div className="flex items-center justify-end gap-4 pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="h-12 px-8 font-bold gap-2 shadow-md"
                  >
                    <span>Proceed to Review Booking</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              /* STEP 2: REVIEW ITINERARY & MOCK PAYMENT */
              <div className="space-y-6">
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                    Review Your Itinerary & Payment
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Double-check passenger details and complete mock reservation.
                  </p>
                </div>

                {/* Review Itinerary Card */}
                <Card>
                  <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 px-6">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Plane className="h-4 w-4 text-primary" />
                      <span>Flight Itinerary Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-heading font-extrabold text-xs">
                          {firstSegment.carrierCode}
                        </div>
                        <div>
                          <p className="font-heading text-sm font-bold text-foreground">
                            {firstSegment.carrierName} ({firstSegment.flightNumber})
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {firstSegment.aircraft} • {activeOffer.cabin.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <Badge variant="outline" className="font-mono text-xs">
                          {activeOffer.slices[0].stops === 0
                            ? "Non-stop"
                            : `${activeOffer.slices[0].stops} stop`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {formatDuration(activeOffer.slices[0].durationMinutes)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl border border-border bg-muted/20">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Departure
                        </span>
                        <div className="font-heading text-base font-bold text-foreground mt-1">
                          {formatTime(activeOffer.slices[0].departureTime)} •{" "}
                          {activeOffer.slices[0].departureAirport}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {originAirport?.name}
                          {firstSegment.departureTerminal
                            ? ` • Terminal ${firstSegment.departureTerminal}`
                            : ""}
                        </p>
                        <p className="text-[11px] text-primary font-medium mt-1">
                          {formatDate(activeOffer.slices[0].departureTime, "medium")}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-muted/20">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Arrival
                        </span>
                        <div className="font-heading text-base font-bold text-foreground mt-1">
                          {formatTime(activeOffer.slices[0].arrivalTime)} •{" "}
                          {activeOffer.slices[0].arrivalAirport}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {destAirport?.name}
                          {firstSegment.arrivalTerminal
                            ? ` • Terminal ${firstSegment.arrivalTerminal}`
                            : ""}
                        </p>
                        <p className="text-[11px] text-primary font-medium mt-1">
                          {formatDate(activeOffer.slices[0].arrivalTime, "medium")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Passenger Roster Card */}
                <Card>
                  <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 px-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>Passengers ({passengers.length})</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs h-7 text-primary hover:text-primary font-semibold"
                    >
                      Edit Details
                    </Button>
                  </CardHeader>

                  <CardContent className="p-6 divide-y divide-border/60">
                    {passengers.map((pax) => (
                      <div
                        key={pax.id}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-heading font-bold text-sm text-foreground">
                            {pax.title} {pax.firstName} {pax.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground capitalize">
                            {pax.type} • {pax.gender}
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-muted-foreground">
                          <span>Cabin: {activeOffer.baggage.cabin}</span>
                          <span className="block font-medium text-emerald-700 dark:text-emerald-400">
                            Check-in: {activeOffer.baggage.checked}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Review Contact Details */}
                <Card>
                  <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 px-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Contact Details</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs h-7 text-primary hover:text-primary font-semibold"
                    >
                      Edit Contact
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Email Address:</span>
                        <span className="font-bold text-foreground mt-0.5 block">
                          {contact.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Mobile Number:</span>
                        <span className="font-bold text-foreground mt-0.5 block font-mono">
                          {contact.countryCode} {contact.phone}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mock Payment Selector Card */}
                <Card className="border-accent/40 bg-card shadow-soft-md">
                  <CardHeader className="border-b border-border/60 py-4 px-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        <span>Mock Payment Gateway (Instant Simulation)</span>
                      </CardTitle>
                      <Badge variant="success" className="text-[10px]">
                        100% Sandbox Safe
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Select your preferred payment method. No real bank charges will occur.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          paymentMethod === "upi"
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <QrCode className="h-5 w-5 mb-1 text-primary" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <CreditCard className="h-5 w-5 mb-1 text-primary" />
                        <span>Credit / Debit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          paymentMethod === "netbanking"
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <Building className="h-5 w-5 mb-1 text-primary" />
                        <span>Net Banking</span>
                      </button>
                    </div>

                    {/* Method Specific Mock Fields */}
                    {paymentMethod === "upi" && (
                      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            Pay with UPI ID or Apps
                          </span>
                          <div className="flex gap-1.5">
                            <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border font-bold text-foreground">
                              GPay
                            </span>
                            <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border font-bold text-foreground">
                              PhonePe
                            </span>
                            <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border font-bold text-foreground">
                              Paytm
                            </span>
                          </div>
                        </div>
                        <Input
                          placeholder="e.g. aditya@okhdfcbank"
                          defaultValue="traveller@upi"
                          className="font-mono text-xs"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Enter any virtual payment address for instant automated confirmation.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">
                            Card Number
                          </label>
                          <Input
                            placeholder="4532 •••• •••• 8892"
                            defaultValue="4532 8920 1829 4819"
                            className="font-mono text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                              Expiry MM/YY
                            </label>
                            <Input defaultValue="11/29" className="font-mono text-xs" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                              CVV / CVC
                            </label>
                            <Input
                              defaultValue="782"
                              type="password"
                              maxLength={4}
                              className="font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                        <span className="text-xs font-semibold text-foreground block">
                          Popular Indian Banks
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"].map((bank, idx) => (
                            <button
                              key={bank}
                              type="button"
                              className={`p-2 rounded-lg border text-xs font-medium ${
                                idx === 0
                                  ? "border-primary bg-primary/10 text-primary font-bold"
                                  : "border-border bg-card text-foreground"
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs text-muted-foreground leading-snug cursor-pointer"
                      >
                        I confirm that passenger names match official IDs, and agree to
                        AeroBook&apos;s{" "}
                        <span className="text-foreground underline">Fare Rules</span>, baggage
                        policies, and conditions of carriage.
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/80">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        <span>Edit Details</span>
                      </Button>

                      <Button
                        type="button"
                        variant="accent"
                        size="lg"
                        disabled={isSubmitting || !termsAgreed}
                        onClick={handleConfirmBooking}
                        className="h-12 px-8 font-bold gap-2 shadow-md min-w-[200px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Confirming Reservation...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm & Pay {formatCurrency(activeOffer.price.amount)}</span>
                            <CheckCircle2 className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Flight Fare & Guarantees Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="border-border bg-card shadow-soft-sm">
              <CardHeader className="border-b border-border/60 pb-3.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {activeOffer.slices[0].departureAirport} ✈{" "}
                    {activeOffer.slices[0].arrivalAirport}
                  </Badge>
                  <span className="text-xs font-semibold text-primary capitalize">
                    {activeOffer.cabin} Class
                  </span>
                </div>
                <CardTitle className="text-base mt-2">Flight Fare Breakdown</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4 text-xs">
                {/* Flight snippet */}
                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{firstSegment.carrierName}</span>
                    <span className="font-mono">{firstSegment.flightNumber}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>{formatDate(activeOffer.slices[0].departureTime, "short")}</span>
                    <span>{formatDuration(activeOffer.slices[0].durationMinutes)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Base Airfare ({passengers.length} pax)</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(activeOffer.price.baseFare)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Airport Taxes & UDF</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(Math.round(activeOffer.price.taxes * 0.75))}
                  </span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>GST & Fuel Surcharge</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(Math.round(activeOffer.price.taxes * 0.25))}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <span>Convenience Fee</span>
                  <span>₹0 (Waived)</span>
                </div>

                <div className="border-t border-border/80 pt-4 flex items-baseline justify-between">
                  <div>
                    <span className="font-heading text-sm font-bold text-foreground block">
                      Total Payable
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      All taxes and charges included
                    </span>
                  </div>
                  <span className="font-heading text-2xl font-extrabold text-foreground">
                    {formatCurrency(activeOffer.price.amount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* AeroBook Safety Guarantees */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>AeroBook Assurance</span>
              </div>
              <ul className="space-y-2 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Instant PNR & E-Ticket issuance</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Luggage className="h-3 w-3 text-primary shrink-0" />
                  <span>Cabin baggage {activeOffer.baggage.cabin} included</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>256-bit bank-grade SSL encrypted checkout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

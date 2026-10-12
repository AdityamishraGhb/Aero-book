"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeftRight, Search, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AirportCombobox } from "./airport-combobox";
import { TravellersPopover } from "./travellers-popover";
import { buildSearchUrl } from "@/lib/url";
import { cn } from "@/lib/utils";

// Format a Date object to YYYY-MM-DD
function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const searchFormSchema = z
  .object({
    trip: z.enum(["oneway", "roundtrip"]),
    from: z.string().length(3, "Please select an origin airport"),
    to: z.string().length(3, "Please select a destination airport"),
    depart: z.string().min(1, "Departure date is required"),
    return: z.string().optional(),
    adults: z.number().int().min(1).max(9),
    children: z.number().int().min(0).max(8),
    infants: z.number().int().min(0).max(4),
    cabin: z.enum(["economy", "premium-economy", "business", "first"]),
    directOnly: z.boolean(),
  })
  .refine((data) => data.from !== data.to, {
    message: "Origin and destination airports must be different",
    path: ["to"],
  })
  .refine(
    (data) => {
      if (data.trip === "roundtrip" && data.return) {
        return data.return >= data.depart;
      }
      return true;
    },
    {
      message: "Return date cannot be earlier than departure date",
      path: ["return"],
    }
  );

export type FlightSearchFormData = z.infer<typeof searchFormSchema>;

interface FlightSearchFormProps {
  initialValues?: Partial<FlightSearchFormData>;
  className?: string;
}

export function FlightSearchForm({ initialValues, className }: FlightSearchFormProps) {
  const router = useRouter();

  // Compute sensible default dates based on today
  const todayIso = React.useMemo(() => formatDateToIso(new Date()), []);
  const defaultDepartIso = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatDateToIso(d);
  }, []);
  const defaultReturnIso = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return formatDateToIso(d);
  }, []);

  const form = useForm<FlightSearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      trip: initialValues?.trip || "oneway",
      from: initialValues?.from || "DEL", // Sensible India default: New Delhi
      to: initialValues?.to || "BOM", // Sensible default destination: Mumbai
      depart: initialValues?.depart || defaultDepartIso,
      return: initialValues?.return || defaultReturnIso,
      adults: initialValues?.adults || 1,
      children: initialValues?.children || 0,
      infants: initialValues?.infants || 0,
      cabin: initialValues?.cabin || "economy",
      directOnly: initialValues?.directOnly || false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentTrip = watch("trip");
  const currentFrom = watch("from");
  const currentTo = watch("to");
  const currentDepart = watch("depart");
  const currentChildren = watch("children");
  const currentInfants = watch("infants");
  const currentCabin = watch("cabin");

  // Swap origin and destination
  const handleSwapAirports = () => {
    setValue("from", currentTo, { shouldValidate: true });
    setValue("to", currentFrom, { shouldValidate: true });
  };

  const onSubmit = (data: FlightSearchFormData) => {
    const url = buildSearchUrl({
      from: data.from,
      to: data.to,
      depart: data.depart,
      return: data.trip === "roundtrip" ? data.return : undefined,
      trip: data.trip,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
      cabin: data.cabin,
      directOnly: data.directOnly,
    });

    router.push(url);
  };

  return (
    <div
      data-testid="flight-search-panel"
      className={cn(
        "rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-soft-xl transition-all",
        className
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Top Controls: Trip Type Selector & Direct Flights Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          {/* Trip Type Pills */}
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setValue("trip", "oneway")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-semibold transition-all",
                currentTrip === "oneway"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              One-way
            </button>
            <button
              type="button"
              onClick={() => setValue("trip", "roundtrip")}
              className={cn(
                "rounded-lg px-3.5 py-1 text-xs font-semibold transition-all",
                currentTrip === "roundtrip"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Round-trip
            </button>
          </div>

          {/* Direct Flights Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              {...form.register("directOnly")}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span className="font-medium">Direct flights only</span>
          </label>
        </div>

        {/* Main Search Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-start">
          {/* Origin & Destination with Swap Button (lg: 5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col sm:flex-row items-center gap-2">
            {/* Origin Airport */}
            <Controller
              name="from"
              control={control}
              render={({ field }) => (
                <AirportCombobox
                  label="From"
                  value={field.value}
                  onChange={field.onChange}
                  excludeIata={currentTo}
                  error={errors.from?.message}
                />
              )}
            />

            {/* Swap Button */}
            <div className="sm:mt-5 self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapAirports}
                aria-label="Swap origin and destination airports"
                className="rounded-full shadow-xs hover:border-primary hover:text-primary transition-transform active:rotate-180"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination Airport */}
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <AirportCombobox
                  label="To"
                  value={field.value}
                  onChange={field.onChange}
                  excludeIata={currentFrom}
                  error={errors.to?.message}
                />
              )}
            />
          </div>

          {/* Dates: Departure & Optional Return (lg: 4 cols for roundtrip, 3 cols for oneway) */}
          <div
            className={cn(
              "grid gap-2 items-start",
              currentTrip === "roundtrip"
                ? "grid-cols-1 sm:grid-cols-2 lg:col-span-4"
                : "grid-cols-1 lg:col-span-3"
            )}
          >
            {/* Departure Date */}
            <div className="flex-1 min-w-[140px]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Departure
              </span>
              <div className="relative">
                <input
                  type="date"
                  min={todayIso}
                  {...form.register("depart")}
                  aria-label="Departure date"
                  className={cn(
                    "w-full h-14 px-3.5 rounded-xl border bg-card text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors.depart ? "border-destructive" : "border-border"
                  )}
                />
                <Calendar className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.depart && (
                <span className="text-[11px] text-destructive mt-1 block">
                  {errors.depart.message}
                </span>
              )}
            </div>

            {/* Return Date (Hidden for one-way) */}
            {currentTrip === "roundtrip" && (
              <div className="flex-1 min-w-[140px] animate-in fade-in-50 duration-200">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Return
                </span>
                <div className="relative">
                  <input
                    type="date"
                    min={currentDepart || todayIso}
                    {...form.register("return")}
                    aria-label="Return date"
                    className={cn(
                      "w-full h-14 px-3.5 rounded-xl border bg-card text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                      errors.return ? "border-destructive" : "border-border"
                    )}
                  />
                  <Calendar className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.return && (
                  <span className="text-[11px] text-destructive mt-1 block">
                    {errors.return.message}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Travellers & Cabin Class (lg: 3 cols for roundtrip, 4 cols for oneway) */}
          <div className={cn(currentTrip === "roundtrip" ? "lg:col-span-3" : "lg:col-span-4")}>
            <Controller
              name="adults"
              control={control}
              render={({ field: adultsField }) => (
                <TravellersPopover
                  adults={adultsField.value}
                  childrenCount={currentChildren}
                  infants={currentInfants}
                  cabin={currentCabin}
                  onChange={({ adults, children, infants, cabin }) => {
                    setValue("adults", adults);
                    setValue("children", children);
                    setValue("infants", infants);
                    setValue("cabin", cabin);
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* Bottom Row: Validation Error Warning + Submit CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Search over 1,200+ global air routes with zero markup</span>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-sm font-bold gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Search Flights</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

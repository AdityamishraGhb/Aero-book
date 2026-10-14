"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeftRight, Search, ChevronDown } from "lucide-react";
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
    <div data-testid="flight-search-panel" className={cn("w-full transition-all", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Top Controls: Trip Type Pills / Dropdown */}
        <div className="flex items-center gap-2 text-white">
          <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setValue("trip", "roundtrip")}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                currentTrip === "roundtrip"
                  ? "bg-white text-[#05203c] font-bold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <span>Round-trip</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
            <button
              type="button"
              onClick={() => setValue("trip", "oneway")}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                currentTrip === "oneway"
                  ? "bg-white text-[#05203c] font-bold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <span>One-way</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
          </div>
        </div>

        {/* Skyscanner Signature Unified Segmented Horizontal Bar */}
        <div className="flex flex-col lg:flex-row items-stretch bg-white rounded-xl shadow-2xl border border-slate-200 overflow-visible lg:overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Origin Airport */}
          <div className="flex-1 min-w-0 min-h-[64px] flex items-center bg-white relative">
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
                  variant="unified"
                />
              )}
            />
          </div>

          {/* Swap Button (Centered between From and To) */}
          <div className="relative z-10 flex items-center justify-center -my-3.5 lg:my-0 lg:-mx-4 shrink-0 pointer-events-auto">
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Swap origin and destination airports"
              className="h-8 w-8 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 transition-transform active:rotate-180 flex items-center justify-center cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="flex-1 min-w-0 min-h-[64px] flex items-center bg-white relative">
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <AirportCombobox
                  label="To"
                  placeholder="Country, city or airport"
                  value={field.value}
                  onChange={field.onChange}
                  excludeIata={currentFrom}
                  error={errors.to?.message}
                  variant="unified"
                />
              )}
            />
          </div>

          {/* Departure Date */}
          <div className="flex-1 min-w-0 min-h-[64px] px-4 py-2.5 flex flex-col justify-center bg-white hover:bg-slate-50 transition-colors">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              Depart
            </span>
            <input
              type="date"
              min={todayIso}
              {...form.register("depart")}
              aria-label="Departure date"
              className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 focus:outline-none cursor-pointer border-0 p-0"
            />
          </div>

          {/* Return Date (Roundtrip only) */}
          {currentTrip === "roundtrip" && (
            <div className="flex-1 min-w-0 min-h-[64px] px-4 py-2.5 flex flex-col justify-center bg-white hover:bg-slate-50 transition-colors animate-in fade-in-50 duration-200">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                Return
              </span>
              <input
                type="date"
                min={currentDepart || todayIso}
                {...form.register("return")}
                aria-label="Return date"
                className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 focus:outline-none cursor-pointer border-0 p-0"
              />
            </div>
          )}

          {/* Travellers & Cabin Class */}
          <div className="flex-1 min-w-0 min-h-[64px] flex items-center bg-white relative">
            <Controller
              name="adults"
              control={control}
              render={({ field: adultsField }) => (
                <TravellersPopover
                  adults={adultsField.value}
                  childrenCount={currentChildren}
                  infants={currentInfants}
                  cabin={currentCabin}
                  variant="unified"
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

          {/* Skyscanner Search CTA Button */}
          <Button
            type="submit"
            aria-label="Search flights"
            className="h-auto min-h-[64px] px-8 bg-[#0062E3] hover:bg-[#0050ba] text-white font-bold text-base flex items-center justify-center gap-2 rounded-none rounded-b-xl lg:rounded-b-none lg:rounded-r-xl transition-colors shrink-0 shadow-sm cursor-pointer border-0"
          >
            <span>Search</span>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Validation Errors If Any */}
        {(errors.from || errors.to || errors.depart || errors.return) && (
          <div className="text-xs text-red-200 font-medium bg-red-900/60 border border-red-700/60 px-3.5 py-1.5 rounded-lg inline-block">
            {errors.from?.message ||
              errors.to?.message ||
              errors.depart?.message ||
              errors.return?.message}
          </div>
        )}

        {/* Skyscanner Checkbox Row Below Search Bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-white">
          <label className="flex items-center gap-2 cursor-pointer select-none text-white/90 hover:text-white">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/40 bg-white/20 text-[#0062E3] focus:ring-0 cursor-pointer accent-[#0062E3]"
            />
            <span>Add nearby airports</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-white/90 hover:text-white">
            <input
              type="checkbox"
              {...form.register("directOnly")}
              className="h-4 w-4 rounded border-white/40 bg-white/20 text-[#0062E3] focus:ring-0 cursor-pointer accent-[#0062E3]"
            />
            <span className="font-semibold">Direct flights</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-white/90 hover:text-white">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-white/40 bg-white/20 text-[#0062E3] focus:ring-0 cursor-pointer accent-[#0062E3]"
            />
            <span>Add a place to stay</span>
          </label>
        </div>
      </form>
    </div>
  );
}

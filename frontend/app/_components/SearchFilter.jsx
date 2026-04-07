"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Stethoscope } from "lucide-react";

function SearchFilter({
  specialties = [],
  locations = [],
  initialValues,
  onChange,
  onApply,
  className = "",
  submitLabel = "Search",
}) {
  const [filters, setFilters] = useState({
    specialty: initialValues?.specialty || "",
    location: initialValues?.location || "",
  });

  useEffect(() => {
    setFilters({
      specialty: initialValues?.specialty || "",
      location: initialValues?.location || "",
    });
  }, [initialValues?.specialty, initialValues?.location]);

  const specialtyOptions = useMemo(
    () => [...new Set(specialties.filter(Boolean))],
    [specialties],
  );

  const locationOptions = useMemo(
    () => [...new Set(locations.filter(Boolean))],
    [locations],
  );

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (onChange) {
      onChange(next);
    }
  };

  const clearFilters = () => {
    const next = { specialty: "", location: "" };
    setFilters(next);
    if (onChange) {
      onChange(next);
    }
    if (onApply) {
      onApply(next);
    }
  };

  const applyFilters = () => {
    if (onApply) {
      onApply(filters);
    }
  };

  return (
    <div className={"card-surface p-4 " + className}>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <label className="block">
          <span
            className="mb-1 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Specialty
          </span>
          <div className="relative">
            <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={filters.specialty}
              onChange={(event) =>
                updateFilter("specialty", event.target.value)
              }
              className="h-12 w-full appearance-none rounded-xl border ps-10 pe-3 text-sm outline-none"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                background: "var(--color-bg-primary)",
              }}
            >
              <option value="">All specialties</option>
              {specialtyOptions.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span
            className="mb-1 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Location
          </span>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border ps-10 pe-3 text-sm outline-none"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                background: "var(--color-bg-primary)",
              }}
            >
              <option value="">All locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </label>

        <Button
          type="button"
          onClick={clearFilters}
          variant="outline"
          className="h-12 rounded-xl"
        >
          Clear
        </Button>

        <Button
          type="button"
          onClick={applyFilters}
          className="h-12 rounded-xl text-white"
          style={{ background: "var(--color-accent)" }}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export default SearchFilter;

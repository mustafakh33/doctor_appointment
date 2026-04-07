"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  SearchX,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories, getDoctors } from "@/app/_utils/Api";
import DoctorCard from "@/app/_components/DoctorCard";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory } from "@/app/_utils/localize";

const ITEMS_PER_PAGE = 8;

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

function DoctorsPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: searchParams.get("categoryId") || "",
    specialty: searchParams.get("specialty") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, Number(searchParams.get("page")) || 1),
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const categoryIdFromQuery = searchParams.get("categoryId") || undefined;
      const [doctorData, categoryData] = await Promise.all([
        getDoctors(
          categoryIdFromQuery ? { categoryId: categoryIdFromQuery } : {},
        ),
        getCategories(),
      ]);
      setDoctors(doctorData);
      setCategories(categoryData);
      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  useEffect(() => {
    setFilters({
      categoryId: searchParams.get("categoryId") || "",
      specialty: searchParams.get("specialty") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });

    setCurrentPage(Math.max(1, Number(searchParams.get("page")) || 1));
  }, [searchParams]);

  const specialties = useMemo(
    () =>
      categories
        .map((category) => ({
          id: category?.documentId || category?.id || "",
          label: localizeCategory(category, locale),
        }))
        .filter((category) => category.id && category.label),
    [categories, locale],
  );

  const locations = useMemo(
    () =>
      doctors
        .map((doctor) => doctor?.location?.address || doctor?.address)
        .filter(Boolean),
    [doctors],
  );

  const priceRange = useMemo(() => {
    const prices = doctors
      .map((doctor) => toNumber(doctor?.appointment_fee))
      .filter((price) => price !== null);

    if (!prices.length) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const minPrice = toNumber(filters.minPrice);
    const maxPrice = toNumber(filters.maxPrice);

    return doctors.filter((doctor) => {
      const doctorCategory = String(doctor?.category?.name || "").trim();
      const doctorCategoryId = String(doctor?.categoryId || "").trim();
      const doctorLocation = (
        doctor?.location?.address ||
        doctor?.address ||
        ""
      ).toLowerCase();
      const fee = toNumber(doctor?.appointment_fee);

      const selectedCategoryId = String(filters.categoryId || "").trim();
      const selectedSpecialty = String(filters.specialty || "").trim();
      const doctorCategoryLower = doctorCategory.toLowerCase();
      const selectedSpecialtyLower = selectedSpecialty.toLowerCase();

      const categoryIdMatch =
        !selectedCategoryId || doctorCategoryId === selectedCategoryId;
      const categoryNameMatch =
        !selectedSpecialty ||
        doctorCategoryLower === selectedSpecialtyLower ||
        doctorCategoryLower.includes(selectedSpecialtyLower) ||
        selectedSpecialtyLower.includes(doctorCategoryLower);
      const locationMatch =
        !filters.location ||
        doctorLocation.includes(String(filters.location).toLowerCase());
      const minPriceMatch =
        minPrice === null || (fee !== null && fee >= minPrice);
      const maxPriceMatch =
        maxPrice === null || (fee !== null && fee <= maxPrice);

      return (
        categoryIdMatch &&
        categoryNameMatch &&
        locationMatch &&
        minPriceMatch &&
        maxPriceMatch
      );
    });
  }, [
    doctors,
    filters.categoryId,
    filters.location,
    filters.maxPrice,
    filters.minPrice,
    filters.specialty,
  ]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE)),
    [filteredDoctors.length],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredDoctors]);

  const pageNumbers = useMemo(() => {
    const numbers = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);

    for (let page = start; page <= end; page += 1) {
      numbers.push(page);
    }

    if (numbers.length === 1 && totalPages > 1) {
      const fallback = currentPage === 1 ? 2 : currentPage - 1;
      if (!numbers.includes(fallback)) {
        numbers.push(fallback);
        numbers.sort((a, b) => a - b);
      }
    }

    return numbers;
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    const next = {
      categoryId: "",
      specialty: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(next);
    setCurrentPage(1);
    router.replace("/doctors");
  };

  const applyFilters = (nextFilters = filters, nextPage = 1) => {
    setFilters(nextFilters);
    setCurrentPage(nextPage);

    const query = new URLSearchParams();
    if (nextFilters.categoryId) query.set("categoryId", nextFilters.categoryId);
    if (nextFilters.specialty) query.set("specialty", nextFilters.specialty);
    if (nextFilters.location) query.set("location", nextFilters.location);
    if (nextFilters.minPrice) query.set("minPrice", nextFilters.minPrice);
    if (nextFilters.maxPrice) query.set("maxPrice", nextFilters.maxPrice);
    if (nextPage > 1) query.set("page", String(nextPage));

    const queryString = query.toString();
    router.replace(queryString ? "/doctors?" + queryString : "/doctors");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    currentPage,
    filters.categoryId,
    filters.location,
    filters.maxPrice,
    filters.minPrice,
    filters.specialty,
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <div
        className="mb-8 rounded-3xl p-8 md:p-10"
        style={{
          background:
            "linear-gradient(125deg, var(--color-primary-50), var(--color-secondary-light))",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                background: "var(--color-bg-primary)",
                color: "var(--color-primary)",
              }}
            >
              {t("nav.doctors", "Doctors")}
            </span>
            <h1
              className="mt-3 text-3xl font-extrabold md:text-5xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("doctorsPage.title")}
            </h1>
            <p
              className="mt-2 max-w-2xl text-sm md:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("doctorsPage.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 self-start md:self-auto">
            <article
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("doctorsPage.total", "Total")}
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {doctors.length}
              </p>
            </article>
            <article
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("doctorsPage.result", "Result")}
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {filteredDoctors.length}
              </p>
            </article>
            <article
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("doctorsPage.page", "Page")}
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {currentPage}/{totalPages}
              </p>
            </article>
          </div>
        </div>
      </div>

      <section className="card-surface mb-7 rounded-3xl p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter
            className="h-4 w-4"
            style={{ color: "var(--color-primary)" }}
          />
          <h2
            className="text-base font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("doctorsPage.filterDoctors", "Filter Doctors")}
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span
              className="mb-1 block text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("doctorsPage.specialty", "Specialty")}
            </span>
            <div className="relative">
              <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={filters.categoryId || filters.specialty}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: event.target.value,
                    specialty: "",
                  }))
                }
                className="h-12 w-full appearance-none rounded-xl border ps-10 pe-3 text-sm outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-bg-primary)",
                }}
              >
                <option value="">
                  {t("doctorsPage.allSpecialties", "All specialties")}
                </option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.label}
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
              {t("doctorsPage.location", "Location")}
            </span>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={filters.location}
                onChange={(event) =>
                  handleFilterChange("location", event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border ps-10 pe-3 text-sm outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-bg-primary)",
                }}
              >
                <option value="">
                  {t("doctorsPage.allLocations", "All locations")}
                </option>
                {[...new Set(locations)].map((location) => (
                  <option key={location} value={location}>
                    {location}
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
              {t("doctorsPage.minPrice", "Min Price (EGP)")}
            </span>
            <div className="relative">
              <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={priceRange.min || 0}
                max={priceRange.max || undefined}
                value={filters.minPrice}
                onChange={(event) =>
                  handleFilterChange("minPrice", event.target.value)
                }
                placeholder={priceRange.min ? String(priceRange.min) : "0"}
                className="h-12 w-full rounded-xl border ps-10 pe-3 text-sm outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-bg-primary)",
                }}
              />
            </div>
          </label>

          <label className="block">
            <span
              className="mb-1 block text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("doctorsPage.maxPrice", "Max Price (EGP)")}
            </span>
            <div className="relative">
              <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={priceRange.min || 0}
                max={priceRange.max || undefined}
                value={filters.maxPrice}
                onChange={(event) =>
                  handleFilterChange("maxPrice", event.target.value)
                }
                placeholder={priceRange.max ? String(priceRange.max) : "1000"}
                className="h-12 w-full rounded-xl border ps-10 pe-3 text-sm outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-bg-primary)",
                }}
              />
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl"
            onClick={clearFilters}
          >
            {t("doctorsPage.clearFilters", "Clear")}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-xl text-white"
            style={{ background: "var(--color-accent)" }}
            onClick={() => applyFilters(filters, 1)}
          >
            {t("common.search")}
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card-surface overflow-hidden">
              <div className="skeleton h-[200px] w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-24 rounded-full" />
                <div className="skeleton h-6 w-40" />
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-4 w-44" />
                <div className="skeleton h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card-surface py-12 text-center">
          <SearchX
            className="mx-auto h-12 w-12"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p
            className="mt-4 text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("emptyState.noDoctorsTitle")}
          </p>
          <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
            {t("emptyState.noDoctorsText")}
          </p>
          <Button onClick={clearFilters} className="mt-5" variant="outline">
            {t("doctorsPage.clearFilters")}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 rounded-full p-0"
              onClick={() =>
                applyFilters(filters, Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
              aria-label={t("doctorsPage.previousPage", "Previous page")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page) => (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? "default" : "outline"}
                className="h-10 min-w-10 rounded-full px-3"
                style={
                  currentPage === page
                    ? { background: "var(--color-accent)", color: "white" }
                    : undefined
                }
                onClick={() => applyFilters(filters, page)}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 rounded-full p-0"
              onClick={() =>
                applyFilters(filters, Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              aria-label={t("doctorsPage.nextPage", "Next page")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default DoctorsPage;

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getCategories, getDoctors } from "@/app/_utils/Api";
import DoctorCard from "@/app/_components/DoctorCard";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory } from "@/app/_utils/localize";

function ExploreClient() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const allCategoryValue = "__all__";

  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(allCategoryValue);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [doctorData, categoryData] = await Promise.all([
        getDoctors(),
        getCategories(),
      ]);
      setDoctors(doctorData);
      setCategories(categoryData);
      setLoading(false);
    };

    loadData();
  }, []);

  const categoryNames = useMemo(() => {
    return [
      { label: t("doctorsPage.all"), value: allCategoryValue },
      ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
    ];
  }, [categories, t]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const nameMatch = doctor?.name
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const categoryMatch =
        activeCategory === allCategoryValue ||
        doctor?.category?.name === activeCategory;

      return nameMatch && categoryMatch;
    });
  }, [doctors, searchTerm, activeCategory]);

  return (
    <div className="page-shell space-y-10 md:px-20">
      <section
        className="rounded-2xl p-6 text-white md:p-8"
        style={{ background: "var(--color-bg-hero)" }}
      >
        <h1 className="text-3xl font-bold md:text-4xl">{t("explore.title")}</h1>
        <p className="mt-2" style={{ color: "var(--color-primary-light)" }}>
          {t("explore.subtitle")}
        </p>

        <div className="relative mt-6 max-w-3xl">
          <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("explore.searchPlaceholder")}
            className="h-12 rounded-full border-0 bg-white pl-12 text-slate-900 shadow-lg"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("explore.browseSpecialty")}
          </h2>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 font-semibold transition-all"
            style={{ color: "var(--color-primary)" }}
          >
            {t("sections.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-flow-col auto-cols-[150px] gap-3 overflow-x-auto md:grid-flow-row md:auto-cols-auto md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search/${cat.name}`}
              className="flex flex-col items-center rounded-xl border bg-white p-4 transition-all"
              style={{
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Image
                src={cat?.icon?.url || "/assets/img/category/default.png"}
                alt={cat?.name}
                width={60}
                height={60}
                className="h-[60px] w-[60px] object-contain"
              />
              <p className="mt-2 text-sm font-medium text-center">
                {localizeCategory(cat, locale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("explore.allDoctors")}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("sections.showingOf", {
              shown: filteredDoctors.length,
              total: doctors.length,
            })}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-2 mb-6">
          {categoryNames.map((categoryName) => (
            <button
              key={categoryName.value}
              onClick={() => setActiveCategory(categoryName.value)}
              className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background:
                  activeCategory === categoryName.value
                    ? "var(--color-primary)"
                    : "var(--color-bg-tertiary)",
                color:
                  activeCategory === categoryName.value
                    ? "var(--color-text-inverse)"
                    : "var(--color-text-primary)",
              }}
              type="button"
            >
              {categoryName.value === allCategoryValue
                ? categoryName.label
                : localizeCategory(categoryName.label, locale)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("emptyState.noDoctorsTitle")}
            </p>
            <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
              {t("emptyState.noDoctorsText")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ExploreClient;

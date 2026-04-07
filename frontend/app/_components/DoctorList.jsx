"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getDoctors } from "../_utils/Api";
import DoctorCard from "./DoctorCard";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory } from "@/app/_utils/localize";

export const DoctorList = ({ limit }) => {
  const { t, locale } = useLanguage();
  const [doctorList, setDoctorList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("__all__");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [doctorData, categoryData] = await Promise.all([
        getDoctors(),
        getCategories(),
      ]);
      setDoctorList(doctorData);
      setCategories(categoryData);
      setLoading(false);
    };
    load();
  }, []);

  const categoryChips = useMemo(
    () => [
      { label: t("doctorsPage.all"), value: "__all__" },
      ...categories.map((cat) => ({ label: cat, value: cat.name })),
    ],
    [categories, t],
  );

  const filteredDoctors = useMemo(() => {
    return doctorList.filter((doctor) => {
      return (
        activeCategory === "__all__" ||
        doctor?.category?.name === activeCategory
      );
    });
  }, [doctorList, activeCategory]);

  const displayList = useMemo(
    () => (limit ? filteredDoctors.slice(0, limit) : filteredDoctors),
    [filteredDoctors, limit],
  );

  return (
    <section
      className="section-shell"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("sections.topDoctors")}
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("sections.showingOf", undefined, {
                shown: displayList.length,
                total: filteredDoctors.length,
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categoryChips.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background:
                  activeCategory === category.value
                    ? "var(--color-primary)"
                    : "var(--color-bg-primary)",
                color:
                  activeCategory === category.value
                    ? "var(--color-text-inverse)"
                    : "var(--color-text-primary)",
              }}
            >
              {category.value === "__all__"
                ? category.label
                : localizeCategory(category.label, locale)}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {!loading && displayList?.length > 0
            ? displayList.map((doctor) => (
                <DoctorCard key={doctor?.id} doctor={doctor} />
              ))
            : Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="card-surface overflow-hidden">
                  <div className="skeleton h-[200px] w-full" />
                  <div className="space-y-3 p-4">
                    <div className="skeleton h-4 w-24 rounded-full" />
                    <div className="skeleton h-6 w-32" />
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-10 w-full rounded-full" />
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 font-semibold transition-all"
            style={{ color: "var(--color-primary)" }}
          >
            {t("sections.viewAllDoctors")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

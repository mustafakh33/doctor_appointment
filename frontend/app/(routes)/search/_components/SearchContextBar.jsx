"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Compass } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { getCategories } from "@/app/_utils/Api";
import { localizeCategory } from "@/app/_utils/localize";

function SearchContextBar() {
  const { categoryName } = useParams();
  const { t, locale } = useLanguage();
  const [categories, setCategories] = useState([]);

  const directoryLabel =
    locale === "ar" ? "دليل التخصصات الطبية" : "Medical Specialty Directory";
  const directoryHint =
    locale === "ar"
      ? "اختر التخصص المناسب للوصول لأفضل الأطباء بسرعة"
      : "Choose the right specialty to quickly find the most relevant doctors";

  const currentCategory = decodeURIComponent(String(categoryName || ""));

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const categoryList = await getCategories();
        if (isMounted) {
          setCategories(Array.isArray(categoryList) ? categoryList : []);
        }
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCategory = useMemo(() => {
    const target = String(currentCategory || "")
      .trim()
      .toLowerCase();
    if (!target) return null;

    return (
      categories.find((category) => {
        const candidates = [
          category?.name,
          category?.name_en,
          category?.name_ar,
        ]
          .filter(Boolean)
          .map((value) => String(value).trim().toLowerCase());

        return candidates.includes(target);
      }) || null
    );
  }, [categories, currentCategory]);

  const categoryLabel = selectedCategory
    ? localizeCategory(selectedCategory, locale)
    : currentCategory;

  return (
    <div
      className="mb-6 overflow-hidden rounded-2xl border px-4 py-4 md:px-5"
      style={{
        borderColor: "var(--color-border)",
        background:
          "linear-gradient(120deg, var(--color-primary-50), var(--color-secondary-light))",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                color: "var(--color-primary)",
                background: "var(--color-bg-primary)",
              }}
            >
              <Compass className="h-3.5 w-3.5" />
              {directoryLabel}
            </div>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {directoryHint}
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-bg-primary)",
          }}
        >
          <Link
            href="/"
            className="font-medium transition hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("nav.home", "Home")}
          </Link>

          <ChevronRight
            className="h-4 w-4"
            style={{ color: "var(--color-text-muted)" }}
          />

          <Link
            href="/doctors"
            className="font-medium transition hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("nav.doctors", "Doctors")}
          </Link>

          <ChevronRight
            className="h-4 w-4"
            style={{ color: "var(--color-text-muted)" }}
          />

          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{
              color: "var(--color-primary)",
              background: "var(--color-primary-light)",
            }}
          >
            {categoryLabel || t("nav.search", "Search")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchContextBar;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "../_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory } from "@/app/_utils/localize";

const CategorySearch = () => {
  const { t, locale } = useLanguage();
  const [categoryList, setCategoryList] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await getCategories();
      setCategoryList(data);
    };
    load();
  }, []);

  const displayCategories = useMemo(() => categoryList, [categoryList]);

  const scrollByAmount = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="section-shell bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-20">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("sections.selectSpecialty")}
            </h2>
            <div
              className="mt-2 h-1 w-16 rounded-full"
              style={{ background: "var(--color-secondary)" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByAmount(-240)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border transition md:flex"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
              aria-label={t("common.back")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(240)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border transition md:flex"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
              aria-label={t("common.next")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 font-semibold transition"
              style={{ color: "var(--color-primary)" }}
            >
              {t("sections.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {categoryList.length === 0 ? (
          <p className="pt-5 text-sm text-slate-500">
            {t("sections.noCategoriesFound")}
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          >
            {displayCategories.map((cat) => (
              <Link
                href={`/search/${cat.name}`}
                key={cat.id}
                className="group w-[130px] shrink-0 snap-start text-center"
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-transparent transition-all duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary-light), var(--color-bg-primary))",
                  }}
                >
                  <Image
                    src={cat?.icon?.url || "/assets/img/category/default.png"}
                    width={50}
                    height={50}
                    alt={cat.name}
                    className="h-[50px] w-[50px] object-contain"
                  />
                </div>
                <p
                  className="mt-3 text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {localizeCategory(cat, locale)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .group:hover div {
          border-color: var(--color-secondary);
          box-shadow: var(--shadow-glow);
          background: var(--color-secondary-light) !important;
        }
      `}</style>
    </section>
  );
};

export default CategorySearch;

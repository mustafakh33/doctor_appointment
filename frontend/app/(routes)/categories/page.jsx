"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Baby,
  Brain,
  HeartPulse,
  Shield,
  Stethoscope,
} from "lucide-react";
import { getCategories } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import Loading from "@/app/_components/loading";
import CategoryCard from "./_components/CategoryCard";

const iconSet = [HeartPulse, Baby, Brain, Shield, Activity, Stethoscope];

function CategoriesPage() {
  const { t, locale } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data || []);
        setError(null);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError(err.message || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <section
        className="rounded-3xl p-8 md:p-10"
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
              {t("nav.categories", "Categories")}
            </span>
            <h1
              className="mt-3 text-3xl font-extrabold md:text-5xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("categories.title")}
            </h1>
            <p
              className="mt-2 max-w-2xl text-sm md:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("categories.subtitle")}
            </p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Available Specialties
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {categories.length}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div
          className="mt-8 rounded-2xl p-4 text-sm"
          style={{
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            borderColor: "var(--color-danger-border)",
          }}
        >
          {error}
        </div>
      )}

      {categories.length === 0 && !error ? (
        <div
          className="mt-8 rounded-2xl p-8 text-center"
          style={{
            background: "var(--color-surface-1)",
            borderColor: "var(--color-border)",
          }}
        >
          <p style={{ color: "var(--color-text-secondary)" }}>
            No categories available at the moment
          </p>
        </div>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, index) => {
            const Icon = iconSet[index % iconSet.length];

            return (
              <CategoryCard
                key={cat.id || cat.documentId}
                category={cat}
                index={index}
                icon={Icon}
                locale={locale}
                t={t}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}

export default CategoriesPage;

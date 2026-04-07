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
import { localizeCategory } from "@/app/_utils/localize";
import Loading from "@/app/_components/loading";

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
            const hasImage = cat?.icon?.url || cat?.image?.url;
            const imageUrl = cat?.icon?.url || cat?.image?.url;

            return (
              <Link
                key={cat.id || cat.documentId}
                href={`/search/${cat.name}`}
                className="group block"
              >
                <article
                  className="relative overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: "var(--color-border)",
                    boxShadow: "var(--shadow-card)",
                    background: "white",
                  }}
                >
                  {/* Image Section */}
                  <div
                    className="flex h-40 w-full items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light))",
                    }}
                  >
                    {hasImage ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <Image
                          src={imageUrl}
                          alt={localizeCategory(cat, locale)}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <Icon
                        className="h-16 w-16"
                        style={{ color: "var(--color-primary)" }}
                      />
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {localizeCategory(cat, locale)}
                        </h3>
                        <p
                          className="mt-1 text-sm leading-6"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {t("categories.doctorsCount", undefined, {
                            count: cat.doctors?.length || 0,
                          })}
                        </p>
                      </div>

                      <div
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "var(--color-secondary-light)",
                          color: "var(--color-secondary-dark)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div
                      className="mt-5 flex items-center justify-between border-t pt-4"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <span
                        className="text-xs font-semibold uppercase tracking-[0.16em]"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Explore
                      </span>
                      <span
                        className="text-sm font-semibold transition-colors group-hover:opacity-80"
                        style={{ color: "var(--color-primary)" }}
                      >
                        View Doctors →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default CategoriesPage;

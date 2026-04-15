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
import CategoriesHeader from "./_components/CategoriesHeader";
import CategoryCard from "./_components/CategoryCard";
import CategorySkeletonGrid from "./_components/CategorySkeletonGrid";

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

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <CategoriesHeader count={categories.length} />

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

      <div className="mt-8">
        {loading ? (
          <CategorySkeletonGrid />
        ) : categories.length === 0 && !error ? (
          <div
            className="rounded-2xl p-8 text-center"
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
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 opacity-100">
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
    </div>
  );
}

export default CategoriesPage;

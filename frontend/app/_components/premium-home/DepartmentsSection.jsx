import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Baby,
  Brain,
  HeartPulse,
  Shield,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory } from "@/app/_utils/localize";
import CategoryCardSkeleton from "./CategoryCardSkeleton";

const fallbackIcons = [HeartPulse, Baby, Brain, Shield, Activity, Stethoscope];
const SKELETON_COUNT = 8;

function DepartmentsSection({
  departments = [],
  loading = false,
  error = null,
}) {
  const { locale, t } = useLanguage();

  return (
    <section
      className="px-5 py-14 md:px-20 md:py-16"
      style={{ background: "var(--color-departments-bg)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2
              className="text-3xl font-semibold leading-none tracking-tight md:text-5xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("premiumHome.departments.title", "Departments")}
            </h2>
            <p
              className="mt-3 max-w-2xl text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t(
                "premiumHome.departments.description",
                "Access world-class expertise across all major medical fields with curated precision.",
              )}
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
          >
            {t("premiumHome.departments.viewAll", "View All Specialties")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <CategoryCardSkeleton key={`category-skeleton-${index}`} />
              ))}
            </div>
          ) : error ? (
            <div
              className="w-full rounded-xl p-4"
              style={{
                background: "var(--color-danger-light)",
                color: "var(--color-danger)",
              }}
            >
              {error}
            </div>
          ) : departments.length === 0 ? (
            <div
              className="w-full rounded-xl p-8 text-center"
              style={{
                background: "var(--color-surface-1)",
              }}
            >
              <p style={{ color: "var(--color-text-secondary)" }}>
                {t("premiumHome.departments.empty", "No departments available")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 transition-opacity duration-500 md:grid-cols-3 lg:grid-cols-4">
              {departments.map((department, index) => {
                const Icon = fallbackIcons[index % fallbackIcons.length];
                const departmentId =
                  department?.documentId || department?.id || "";
                const href = departmentId
                  ? `/doctors?categoryId=${encodeURIComponent(departmentId)}`
                  : `/doctors?specialty=${encodeURIComponent(department.name || "")}`;
                const categoryName = localizeCategory(department, locale);
                const hasImage = department?.icon?.url || department?.image?.url;
                const doctorsCount = Number(
                  department?.doctorsCount || department?.doctors?.length || 0,
                );

                return (
                  <Link
                    key={department.id || department.documentId || index}
                    href={href}
                    className="group block"
                  >
                    <div
                      className="relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "var(--color-surface-1)",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      {/* Image or Icon Background */}
                      <div
                        className="flex h-32 w-full items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light))",
                        }}
                      >
                        {hasImage ? (
                          <div className="relative h-20 w-20 overflow-hidden rounded-full">
                            <Image
                              src={department.icon?.url || department.image?.url}
                              alt={categoryName}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Icon
                            className="h-16 w-16"
                            style={{ color: "var(--color-primary)" }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3
                          className="font-semibold leading-tight"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {categoryName}
                        </h3>
                        <p
                          className="mt-1 text-xs leading-5"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {doctorsCount}{" "}
                          {t(
                            "premiumHome.departments.specialistsAvailable",
                            "Specialists Available",
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DepartmentsSection;

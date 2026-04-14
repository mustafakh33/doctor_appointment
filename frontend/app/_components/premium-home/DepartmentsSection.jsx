import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
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
import useHorizontalScroll from "./useHorizontalScroll";

const fallbackIcons = [HeartPulse, Baby, Brain, Shield, Activity, Stethoscope];
const SKELETON_COUNT = 8;

function DepartmentsSection({
  departments = [],
  loading = false,
  error = null,
}) {
  const { locale, t } = useLanguage();
  const { containerRef, canScrollPrev, canScrollNext, scrollByDirection } =
    useHorizontalScroll();

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

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => scrollByDirection("prev")}
            disabled={!canScrollPrev}
            aria-label={t("common.previous", "Previous")}
            className="absolute top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 shadow-lg transition md:inline-flex"
            style={{
              insetInlineStart: "-14px",
              background: "var(--color-surface-1)",
              color: "var(--color-text-primary)",
              opacity: canScrollPrev ? 1 : 0.45,
              pointerEvents: canScrollPrev ? "auto" : "none",
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollByDirection("next")}
            disabled={!canScrollNext}
            aria-label={t("common.next", "Next")}
            className="absolute top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 shadow-lg transition md:inline-flex"
            style={{
              insetInlineEnd: "-14px",
              background: "var(--color-surface-1)",
              color: "var(--color-text-primary)",
              opacity: canScrollNext ? 1 : 0.45,
              pointerEvents: canScrollNext ? "auto" : "none",
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {loading ? (
            <div
              ref={containerRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="w-56 shrink-0 snap-start md:w-60"
                >
                  <CategoryCardSkeleton />
                </div>
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
            <div
              ref={containerRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 transition-opacity duration-500"
            >
              {departments.map((department, index) => {
                const Icon = fallbackIcons[index % fallbackIcons.length];
                const departmentId =
                  department?.documentId || department?.id || "";
                const href = departmentId
                  ? `/doctors?categoryId=${encodeURIComponent(departmentId)}`
                  : `/doctors?specialty=${encodeURIComponent(department.name || "")}`;
                const categoryName = localizeCategory(department, locale);
                const hasImage =
                  department?.icon?.url || department?.image?.url;
                const doctorsCount = Number(
                  department?.doctorsCount || department?.doctors?.length || 0,
                );

                return (
                  <Link
                    key={department.id || department.documentId || index}
                    href={href}
                    className="group block w-56 shrink-0 snap-start md:w-60"
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
                              src={
                                department.icon?.url || department.image?.url
                              }
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

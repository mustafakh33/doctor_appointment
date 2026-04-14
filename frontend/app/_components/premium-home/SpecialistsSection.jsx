import { useLanguage } from "@/app/_context/LanguageContext";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import DoctorCard from "@/app/_components/DoctorCard";
import DoctorCardSkeleton from "./DoctorCardSkeleton";
import useHorizontalScroll from "./useHorizontalScroll";

const SKELETON_COUNT = 8;

function SpecialistsSection({ doctors = [], loading = false }) {
  const { t } = useLanguage();
  const { containerRef, canScrollPrev, canScrollNext, scrollByDirection } =
    useHorizontalScroll();

  const normalizedDoctors = (doctors || [])
    .map((doctor, index) => ({
      id: doctor?.id || index + 1,
      documentId: doctor?.id || doctor?.documentId || index + 1,
      name:
        doctor?.name ||
        t("premiumHome.doctors.fallbackName", undefined, { index: index + 1 }),
      category: doctor?.category || {
        name: doctor?.specialty || t("premiumHome.doctors.specialistCare"),
      },
      address:
        doctor?.address ||
        doctor?.location ||
        t("premiumHome.doctors.premiumCenter"),
      ratingsAverage: Number(doctor?.ratingsAverage || doctor?.rating || 0),
      ratingsQuantity: doctor?.ratingsQuantity || doctor?.reviewCount || 0,
      appointment_fee: doctor?.appointment_fee || doctor?.price,
      year_of_experience: doctor?.year_of_experience || 0,
      image: { url: doctor?.imageUrl || "/assets/img/Doctors/default.png" },
    }))
    .filter((doc) => doc.ratingsAverage > 0)
    .sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    .slice(0, 8);

  return (
    <section
      className="px-5 py-14 md:px-20 md:py-16"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          <h2
            className="text-[40px] font-semibold leading-none tracking-tight md:text-5xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("premiumHome.specialists.title")}
          </h2>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
          >
            {t("premiumHome.specialists.viewAllDoctors", "View All Doctors")}
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
              className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div
                  key={`doctor-skeleton-${index}`}
                  className="w-72 shrink-0 snap-start sm:w-80"
                >
                  <DoctorCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={containerRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 transition-opacity duration-500"
            >
              {normalizedDoctors.map((doctor, index) => (
                <div
                  key={doctor.id || index}
                  className="h-full w-72 shrink-0 snap-start sm:w-80"
                >
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SpecialistsSection;

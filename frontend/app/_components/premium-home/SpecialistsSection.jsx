import { useLanguage } from "@/app/_context/LanguageContext";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DoctorCard from "@/app/_components/DoctorCard";
import DoctorCardSkeleton from "./DoctorCardSkeleton";

const SKELETON_COUNT = 8;

function SpecialistsSection({ doctors = [], loading = false }) {
  const { t } = useLanguage();

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

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <DoctorCardSkeleton key={`doctor-skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 transition-opacity duration-500 md:grid-cols-3 lg:grid-cols-4">
            {normalizedDoctors.map((doctor, index) => (
              <div key={doctor.id || index} className="h-full">
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SpecialistsSection;

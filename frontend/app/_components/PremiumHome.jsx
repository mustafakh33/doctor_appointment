"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getDoctors } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";
import HeroSection from "./premium-home/HeroSection";
import DepartmentsSection from "./premium-home/DepartmentsSection";
import JourneySection from "./premium-home/JourneySection";
import SpecialistsSection from "./premium-home/SpecialistsSection";
import StatsBand from "./premium-home/StatsBand";
import TestimonialsSection from "./premium-home/TestimonialsSection";
import DoctorCtaSection from "./premium-home/DoctorCtaSection";

function PremiumHome() {
  const router = useRouter();
  const { locale, t } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [categoriesResult, doctorsResult] = await Promise.all([
          getCategories(),
          getDoctors(),
        ]);

        if (!active) return;

        setDepartments(Array.isArray(categoriesResult) ? categoriesResult : []);
        setSpecialists(Array.isArray(doctorsResult) ? doctorsResult : []);
      } catch (err) {
        if (active) {
          setError(err?.message || "Failed to load departments");
          setDepartments([]);
          setSpecialists([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  const curatedDepartments = useMemo(() => {
    // Return all departments from API if available, otherwise use empty array
    // The DepartmentsSection component will handle proper localization
    return departments;
  }, [departments]);

  const highlightedDoctors = useMemo(() => {
    const source = [...specialists]
      .filter((doctor) => Number(doctor?.ratingsAverage || 0) > 0)
      .sort(
        (a, b) =>
          Number(b?.ratingsAverage || 0) - Number(a?.ratingsAverage || 0),
      )
      .slice(0, 8);

    return source.map((doctor, index) => ({
      id: doctor?.documentId || doctor?.id || index + 1,
      name:
        localizeDoctorField(doctor, "name", locale) ||
        doctor?.name ||
        t("premiumHome.doctors.fallbackName", undefined, { index: index + 1 }),
      specialty:
        localizeCategory(doctor?.category, locale) ||
        doctor?.category?.name ||
        t("premiumHome.doctors.specialistCare"),
      location:
        localizeDoctorField(doctor, "address", locale) ||
        doctor?.address ||
        t("premiumHome.doctors.premiumCenter"),
      rating: Number(doctor?.ratingsAverage || 4.8),
      reviewCount: doctor?.ratingsQuantity || 160 + index * 10,
      price: Number(doctor?.appointment_fee || 300 + index * 25),
      year_of_experience: Number(doctor?.year_of_experience || 0),
      availability:
        index % 2 === 0
          ? t("premiumHome.doctors.availableToday")
          : t("premiumHome.doctors.nextAvailable", undefined, { time: "5 PM" }),
      slots: ["9:30 AM", "1:00 PM", "5:00 PM"]
        .map((time) => t("premiumHome.doctors.slot", undefined, { time }))
        .slice(0, index % 2 === 0 ? 3 : 2),
      imageUrl: doctor?.image?.url || "/assets/img/Doctors/default.png",
    }));
  }, [locale, specialists, t]);

  const heroDoctor = {
    ...(highlightedDoctors[0] || {}),
    imageUrl: "/assets/img/hero.png",
  };

  const handleHeroSearch = ({ specialty = "", location = "" } = {}) => {
    const query = new URLSearchParams();

    const normalizedSpecialty = String(specialty).trim();
    const normalizedLocation = String(location).trim();

    if (normalizedSpecialty) {
      query.set("specialty", normalizedSpecialty);
    }

    if (normalizedLocation) {
      query.set("location", normalizedLocation);
    }

    const queryString = query.toString();
    router.push(queryString ? `/doctors?${queryString}` : "/doctors");
  };

  const locations = (
    specialists.length
      ? specialists.map(
          (doctor) => doctor?.location?.address || doctor?.address || "",
        )
      : highlightedDoctors.map((doctor) => doctor.location)
  ).filter(Boolean);

  const specialties = curatedDepartments
    .map(
      (department) =>
        department.name || department.name_ar || department.name_en,
    )
    .filter(Boolean);

  return (
    <main style={{ background: "var(--color-bg-primary)" }}>
      <div
        style={{
          background:
            "radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 28%), radial-gradient(circle at 86% 10%, color-mix(in srgb, var(--color-secondary) 24%, transparent), transparent 26%), linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)",
        }}
      >
        <HeroSection
          heroDoctor={heroDoctor}
          doctors={highlightedDoctors}
          specialties={specialties}
          locations={locations}
          onSearch={handleHeroSearch}
        />
      </div>

      <DepartmentsSection
        departments={curatedDepartments}
        loading={loading}
        error={error}
      />
      <JourneySection />
      <SpecialistsSection doctors={highlightedDoctors} />
      <StatsBand />
      <TestimonialsSection />
      <DoctorCtaSection />
    </main>
  );
}

export default PremiumHome;

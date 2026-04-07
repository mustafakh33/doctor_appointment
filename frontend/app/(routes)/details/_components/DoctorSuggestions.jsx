"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getDoctorsByCategory } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";

function DoctorSuggestions({ categoryName, currentDoctorId }) {
  const { t, locale } = useLanguage();
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const [doctorList, categoryList] = await Promise.all([
        getDoctorsByCategory(categoryName),
        getCategories(),
      ]);
      const nextList = doctorList.filter(
        (doctor) => doctor.documentId !== currentDoctorId,
      );
      setFilteredList(nextList);
      setCategories(categoryList);
    };

    if (categoryName) {
      loadSuggestions();
    }
  }, [categoryName, currentDoctorId]);

  const selectedCategory = categories.find(
    (category) => category.name === categoryName,
  );

  return (
    <div
      className="rounded-2xl border bg-white p-5"
      style={{
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="mb-4">
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("doctor.suggestions")}
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {categoryName
            ? t("details.moreSpecialists", {
                category:
                  localizeCategory(selectedCategory, locale) || categoryName,
              })
            : t("details.moreSpecialistsFallback")}
        </p>
      </div>

      <div className="space-y-3">
        {filteredList.length > 0 ? (
          filteredList.map((doctor) => (
            <Link
              key={doctor.documentId}
              href={`/doctors/${doctor.documentId}`}
            >
              <div
                className="flex gap-3 rounded-xl border p-3 transition"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Image
                  src={doctor?.image?.url || "/assets/img/Doctors/default.png"}
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-xl object-cover"
                  alt={doctor?.name}
                />
                <div className="flex flex-col justify-center">
                  <span
                    className="inline-flex w-fit rounded-full px-2 py-1 text-[11px] font-semibold"
                    style={{
                      background: "var(--color-secondary-light)",
                      color: "var(--color-secondary-dark)",
                    }}
                  >
                    {localizeCategory(doctor?.category, locale)}
                  </span>
                  <span
                    className="mt-2 font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {localizeDoctorField(doctor, "name", locale)}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {doctor?.year_of_experience} {t("doctor.yearsExp")}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("details.noSimilarDoctors")}
          </p>
        )}
      </div>
    </div>
  );
}

export default DoctorSuggestions;

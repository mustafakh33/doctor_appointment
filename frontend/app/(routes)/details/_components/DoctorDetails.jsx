"use client";

import React from "react";
import Image from "next/image";
import { GraduationCap, MapPin, Star } from "lucide-react";
import BookAppointment from "./BookAppointment";
import DoctorReviews from "./DoctorReviews";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";

const renderStars = (value = 0) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
    />
  ));
};

function DoctorDetails({ doctor }) {
  const { t, locale } = useLanguage();

  return (
    <>
      <div
        className="grid grid-cols-1 rounded-xl border bg-white p-5 md:grid-cols-3"
        style={{
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* doctor image*/}
        <div>
          <Image
            src={doctor?.image?.url || "/assets/img/Doctors/default.png"}
            width={600}
            height={600}
            alt="image"
            className="rounded-xl border object-cover"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        {/* doctor info*/}
        <div className="col-span-2 mt-4 flex flex-col items-baseline gap-4 md:px-10">
          <h2
            className="mt-4 text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {localizeDoctorField(doctor, "name", locale)}
          </h2>

          <h2
            className="flex gap-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <GraduationCap />
            <span>
              {doctor?.year_of_experience} {t("doctor.yearsExp")}
            </span>
          </h2>

          <h2
            className="flex gap-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <MapPin />
            <span>{localizeDoctorField(doctor, "address", locale)} </span>
          </h2>

          <h2
            className="rounded-full p-2 text-[10px]"
            style={{
              background: "var(--color-secondary-light)",
              color: "var(--color-secondary-dark)",
            }}
          >
            {localizeCategory(doctor?.category, locale)}
          </h2>

          <div
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
            }}
          >
            <div className="flex items-center gap-1">
              {renderStars(doctor?.ratingsAverage)}
            </div>
            <span>
              {doctor?.ratingsAverage
                ? doctor.ratingsAverage.toFixed(1)
                : "0.0"}
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              ({doctor?.ratingsQuantity || 0} {t("doctor.reviews")})
            </span>
          </div>

          <BookAppointment doctor={doctor} />

          <div>
            <h1
              className="text-[25px] font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("doctor.about")}
            </h1>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {" "}
              {localizeDoctorField(doctor, "about", locale)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DoctorReviews doctor={doctor} />
      </div>
    </>
  );
}

export default DoctorDetails;

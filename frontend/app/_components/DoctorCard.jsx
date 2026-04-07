"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  GraduationCap,
  MapPin,
  Star,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";

function DoctorCard({ doctor }) {
  const { t, locale } = useLanguage();
  const ratingValue = doctor?.ratingsAverage
    ? Number(doctor.ratingsAverage).toFixed(1)
    : "0.0";

  return (
    <Link
      href={`/doctors/${doctor?.documentId}`}
      className="group block h-full"
    >
      <article
        className="relative h-full overflow-hidden rounded-xl border transition-all"
        style={{
          background: "var(--color-surface-1)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card)",
          transitionDuration: "var(--transition-normal)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ background: "var(--color-surface-1)" }}
        >
          <Image
            src={doctor?.image?.url || "/assets/img/Doctors/default.png"}
            alt={doctor?.name || t("doctor.name")}
            width={420}
            height={260}
            className="h-auto w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t to-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to top, var(--color-surface-1), transparent)",
            }}
          />
          <span
            className="absolute top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{
              insetInlineEnd: "0.75rem",
              background: "rgba(15, 36, 64, 0.82)",
            }}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {ratingValue}
          </span>
        </div>

        <div className="space-y-2 p-5 text-start">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "var(--color-secondary-light)",
              color: "var(--color-secondary-dark)",
            }}
          >
            {localizeCategory(doctor?.category, locale) || t("nav.categories")}
          </span>

          <h3
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {localizeDoctorField(doctor, "name", locale)}
          </h3>

          <p
            className="mt-2 flex items-center gap-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <MapPin
              className="h-4 w-4"
              style={{ color: "var(--color-secondary-dark)" }}
            />
            {localizeDoctorField(doctor, "address", locale) ||
              t("doctor.address")}
          </p>

          <p
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <GraduationCap
              className="h-4 w-4"
              style={{ color: "var(--color-secondary-dark)" }}
            />
            {doctor?.year_of_experience || 0} {t("doctor.yearsExp")}
          </p>

          <p
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            <Wallet className="h-4 w-4" />
            {doctor?.appointment_fee ?? "N/A"} EGP
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-medium text-white transition-all"
              style={{
                background: "var(--color-accent)",
                transitionDuration: "var(--transition-normal)",
              }}
            >
              {t("doctor.bookNow")}
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
      <style jsx>{`
        .group:hover article {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
          border-left: 3px solid var(--color-primary);
        }

        .group:hover button {
          transform: scale(1.02);
          background: var(--color-accent-dark);
        }

        html[dir="rtl"] .group:hover article {
          border-left: 1px solid var(--color-border);
          border-right: 3px solid var(--color-primary);
        }
      `}</style>
    </Link>
  );
}

export default DoctorCard;

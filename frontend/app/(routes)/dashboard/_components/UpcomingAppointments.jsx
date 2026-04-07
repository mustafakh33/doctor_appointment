"use client";

import Link from "next/link";
import { CalendarClock, Stethoscope } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import StatusBadge from "@/app/(routes)/my-booking/_components/StatusBadge";

const formatDate = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

function UpcomingAppointments({ appointments }) {
  const { t, locale } = useLanguage();

  return (
    <section className="card-surface rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("dashboard.upcomingAppointmentsTitle")}
        </h3>
        <Link
          href="/dashboard?tab=bookings"
          className="text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {t("dashboard.viewAllAppointments")}
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {t("dashboard.noUpcomingAppointments")}
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 4).map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {appointment?.doctor?.name || t("booking.unknownDoctor")}
                  </p>
                  <div
                    className="mt-2 flex flex-wrap items-center gap-3 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="h-4 w-4" />
                      {formatDate(appointment.date, locale)} {appointment.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4" />
                      {appointment?.doctor?.category?.name || t("nav.doctors")}
                    </span>
                  </div>
                </div>

                <StatusBadge status={appointment.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingAppointments;

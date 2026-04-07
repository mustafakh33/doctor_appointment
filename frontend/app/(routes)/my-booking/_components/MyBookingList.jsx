import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Calendar, ExternalLink } from "lucide-react";

import CancelAppointment from "./CancelAppointment";
import RescheduleDialog from "./RescheduleDialog";
import StatusBadge from "./StatusBadge";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";

function MyBookingList({ bookingList, updateAppointment }) {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-4">
      {bookingList.length === 0 && (
        <div className="card-surface py-12 text-center">
          <Calendar
            className="mx-auto h-12 w-12"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p
            className="mt-4 text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("emptyState.noBookingsTitle")}
          </p>
          <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
            {t("emptyState.noBookingsText")}
          </p>
          <Link href="/doctors" className="mt-4 inline-flex">
            <Button
              className="text-white"
              style={{ background: "var(--color-accent)" }}
            >
              {t("trust.findDoctor")}
            </Button>
          </Link>
        </div>
      )}

      {bookingList.map((item, index) => {
        const doctor = item?.doctor;
        const doctorImage =
          doctor?.image?.url || "/assets/img/Doctors/default.png";
        const doctorName =
          localizeDoctorField(doctor, "name", locale) ||
          t("booking.unknownDoctor");
        const doctorSpecialty =
          localizeCategory(doctor?.category, locale) || "—";
        const doctorAddress = doctor?.address || "—";
        const doctorPhone = doctor?.phone || "—";
        const appointmentStatus = item?.status || "confirmed";
        const doctorId = doctor?.documentId || doctor?.id;

        const localizedDate = item?.date
          ? new Date(item.date).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
            )
          : "—";
        const localizedTime = item?.time || "—";

        return (
          <div key={index} className="card-surface p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Image
                src={doctorImage}
                width={100}
                height={100}
                alt={doctorName}
                className="h-[100px] w-[100px] rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className="text-base font-bold sm:text-lg"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {doctorName}
                  </h3>
                  <StatusBadge status={appointmentStatus} />
                </div>

                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-secondary-dark)" }}
                >
                  {doctorSpecialty}
                </p>

                <div
                  className="flex flex-wrap items-center gap-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {doctorAddress}
                  </span>
                  <span style={{ color: "var(--color-text-muted)" }}>|</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {doctorPhone}
                  </span>
                </div>

                <div
                  className="flex flex-wrap items-center gap-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {t("booking.dateTime")}: {localizedDate} - {localizedTime}
                  </span>
                  {appointmentStatus === "canceled" && item?.cancelReason && (
                    <span>
                      ({t("booking.cancelReason")}: {item.cancelReason})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {appointmentStatus !== "canceled" && (
                    <>
                      <RescheduleDialog
                        appointment={item}
                        onReschedule={updateAppointment}
                      />
                      <CancelAppointment
                        appointment={item}
                        onCanceled={updateAppointment}
                      />
                    </>
                  )}

                  {doctorId && (
                    <Link href={`/doctors/${doctorId}`}>
                      <Button variant="ghost" className="gap-1.5">
                        <ExternalLink className="h-4 w-4" />
                        {t("booking.viewDoctor")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyBookingList;

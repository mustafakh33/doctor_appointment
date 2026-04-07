"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useLanguage } from "@/app/_context/LanguageContext";

const convertTimeTo24h = (timeStr) => {
  if (!timeStr) return "00:00";

  const normalized = String(timeStr).trim();
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return normalized;

  let hours = Number(match[1]);
  const minutes = match[2] || "00";
  const period = (match[3] || "").toUpperCase();

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours < 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "var(--color-info)";
    case "completed":
      return "var(--color-success)";
    case "canceled":
      return "var(--color-error)";
    case "pending":
    default:
      return "var(--color-warning)";
  }
};

export default function AppointmentCalendar({
  appointments = [],
  onEventClick,
}) {
  const { locale, t } = useLanguage();

  const events = appointments
    .filter((appointment) => appointment?.date)
    .map((appointment) => ({
      id: appointment.documentId,
      title: appointment.doctor?.name || appointment.userName || "Appointment",
      start: `${appointment.date}T${convertTimeTo24h(appointment.time)}`,
      backgroundColor: getStatusColor(appointment.status),
      borderColor: getStatusColor(appointment.status),
      extendedProps: { appointment },
    }));

  return (
    <div
      className="rounded-3xl border p-3 sm:p-4"
      style={{
        background: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[780px] md:min-w-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            dayMaxEventRows={3}
            fixedWeekCount={false}
            events={events}
            eventClick={(info) =>
              onEventClick?.(info.event.extendedProps.appointment)
            }
            locale={locale === "ar" ? "ar" : "en"}
            direction={locale === "ar" ? "rtl" : "ltr"}
            buttonText={
              locale === "ar"
                ? {
                    today: "اليوم",
                    month: t("calendar.month", "شهر"),
                    week: t("calendar.week", "أسبوع"),
                    day: t("calendar.day", "يوم"),
                  }
                : {
                    today: t("calendar.today", "Today"),
                    month: t("calendar.month", "Month"),
                    week: t("calendar.week", "Week"),
                    day: t("calendar.day", "Day"),
                  }
            }
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}

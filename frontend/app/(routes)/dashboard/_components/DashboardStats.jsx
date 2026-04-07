"use client";

import { CalendarClock, CalendarX2, Bell } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

const statCards = [
  {
    key: "totalAppointments",
    icon: CalendarClock,
    color: "var(--color-primary)",
    bg: "var(--color-primary-50)",
  },
  {
    key: "upcomingAppointments",
    icon: CalendarClock,
    color: "var(--color-success)",
    bg: "color-mix(in srgb, var(--color-success) 16%, var(--color-surface-1))",
  },
  {
    key: "canceledAppointments",
    icon: CalendarX2,
    color: "var(--color-error)",
    bg: "color-mix(in srgb, var(--color-error) 16%, var(--color-surface-1))",
  },
  {
    key: "unreadNotifications",
    icon: Bell,
    color: "var(--color-info)",
    bg: "color-mix(in srgb, var(--color-info) 16%, var(--color-surface-1))",
  },
];

function DashboardStats({ stats }) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="card-surface flex items-center justify-between rounded-2xl p-5"
          >
            <div>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t(`dashboard.${item.key}`)}
              </p>
              <p
                className="mt-2 text-3xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {stats[item.key] || 0}
              </p>
            </div>
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: item.color, background: item.bg }}
            >
              <Icon className="h-5 w-5" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;

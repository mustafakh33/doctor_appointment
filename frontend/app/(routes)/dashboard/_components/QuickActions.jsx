"use client";

import Link from "next/link";
import { CalendarDays, Search, UserRound } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

const actionConfig = [
  {
    key: "bookAppointment",
    href: "/doctors",
    icon: Search,
    color: "var(--color-primary)",
  },
  {
    key: "myBookings",
    href: "/dashboard?tab=bookings",
    icon: CalendarDays,
    color: "var(--color-success)",
  },
  {
    key: "editProfile",
    href: "/dashboard?tab=profile",
    icon: UserRound,
    color: "var(--color-info)",
  },
];

function QuickActions() {
  const { t } = useLanguage();

  return (
    <section className="card-surface rounded-2xl p-6">
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("dashboard.quickActions")}
      </h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {actionConfig.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-xl border p-4 transition-colors hover:bg-slate-50"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background: "var(--color-bg-tertiary)",
                  color: item.color,
                }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p
                className="mt-3 text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t(`dashboard.actions.${item.key}`)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;

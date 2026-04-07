"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

import { getClinic } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";

const dayOrder = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const toLocalDayName = (dayKey, t) => t(`clinic.days.${dayKey}`);

const isTodayRow = (dayKey) => {
  const jsDayToKey = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  return jsDayToKey[new Date().getDay()] === dayKey;
};

function WorkingHours() {
  const { t } = useLanguage();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const loadClinic = async () => {
      const data = await getClinic();
      setClinic(data);
    };

    loadClinic();
  }, []);

  const rows = useMemo(() => {
    const workingHours = clinic?.workingHours || {};

    return dayOrder.map((dayKey) => {
      const day = workingHours?.[dayKey] || {
        open: "09:00",
        close: "17:00",
        isOpen: true,
      };

      return {
        key: dayKey,
        label: toLocalDayName(dayKey, t),
        isOpen: day?.isOpen !== false,
        open: day?.open || "09:00",
        close: day?.close || "17:00",
      };
    });
  }, [clinic, t]);

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Clock
            className="h-5 w-5"
            style={{ color: "var(--color-primary)" }}
          />
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("clinic.workingHoursTitle")}
          </h2>
        </div>

        <div className="card-surface overflow-hidden">
          <div
            className="divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {rows.map((row) => {
              const today = isTodayRow(row.key);

              return (
                <div
                  key={row.key}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6"
                  style={{
                    background: today
                      ? "var(--color-primary-50)"
                      : "transparent",
                  }}
                >
                  <span
                    className="text-sm font-medium md:text-base"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {row.label}
                  </span>

                  {row.isOpen ? (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {row.open} - {row.close}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "var(--color-accent-light)",
                        color: "var(--color-error)",
                      }}
                    >
                      {t("clinic.closed")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkingHours;

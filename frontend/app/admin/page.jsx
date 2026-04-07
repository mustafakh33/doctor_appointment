"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  getAdminAppointments,
  getAdminReports,
  getAdminStats,
} from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";

const statusStyles = {
  pending: { color: "var(--color-warning)", background: "#fff4e5" },
  confirmed: { color: "var(--color-success)", background: "#e6f9ee" },
  canceled: { color: "var(--color-error)", background: "#fde8e8" },
  completed: { color: "var(--color-info)", background: "#e3f2fd" },
};

function StatusPill({ status, t }) {
  const style = statusStyles[status] || statusStyles.confirmed;
  return (
    <span
      className="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
      style={style}
    >
      {t(
        `booking.status${status.charAt(0).toUpperCase()}${status.slice(1)}`,
        status,
      )}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState(null);
  const [reports, setReports] = React.useState(null);
  const [recentAppointments, setRecentAppointments] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [statsData, reportsData, appointmentsResult] = await Promise.all([
        getAdminStats(),
        getAdminReports(),
        getAdminAppointments({ page: 1, limit: 10 }),
      ]);

      setStats(statsData || null);
      setReports(reportsData || null);
      setRecentAppointments(appointmentsResult?.data || []);
      setLoading(false);
    };

    load();
  }, []);

  const statCards = [
    { key: "totalDoctors", value: stats?.doctors || 0 },
    { key: "totalAppointments", value: stats?.appointments || 0 },
    { key: "totalPatients", value: stats?.patients || 0 },
    { key: "avgRating", value: stats?.avgRating || 0 },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("admin.title")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="card-surface rounded-xl p-5">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t(`admin.stats.${card.key}`)}
            </p>
            <p
              className="mt-2 text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card-surface rounded-xl p-5">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("admin.reports.topDoctors")}
          </h2>
          <div className="mt-4 space-y-3">
            {(reports?.topDoctors || []).length === 0 ? (
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("admin.table.noData")}
              </p>
            ) : (
              reports.topDoctors.slice(0, 5).map((doctor, index) => (
                <div
                  key={doctor.doctorId || index}
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <p
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {isRTL ? doctor.name_ar || doctor.name : doctor.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {doctor.count}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card-surface rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("admin.sidebar.appointments")}
            </h2>
            <Link
              href="/admin/appointments"
              className="text-sm font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {t("dashboard.viewAllAppointments")}
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <th className="px-2 py-2 text-left">
                    {t("admin.table.name")}
                  </th>
                  <th className="px-2 py-2 text-left">
                    {t("admin.sidebar.doctors")}
                  </th>
                  <th className="px-2 py-2 text-left">
                    {t("admin.table.date")}
                  </th>
                  <th className="px-2 py-2 text-left">
                    {t("admin.table.status")}
                  </th>
                  <th className="px-2 py-2 text-left">
                    {t("admin.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 py-4 text-center"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {t("admin.table.noData")}
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="px-2 py-3">
                        {item?.user?.name || item.userName || "-"}
                      </td>
                      <td className="px-2 py-3">{item?.doctor?.name || "-"}</td>
                      <td className="px-2 py-3">{item.date}</td>
                      <td className="px-2 py-3">
                        <StatusPill status={item.status || "confirmed"} t={t} />
                      </td>
                      <td className="px-2 py-3">
                        <Link
                          href="/admin/appointments"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {t("admin.appointments.changeStatus")}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

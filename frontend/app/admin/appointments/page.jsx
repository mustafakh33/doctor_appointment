"use client";

import React from "react";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";
import AppointmentCalendar from "@/app/_components/AppointmentCalendar";

const filters = ["all", "confirmed", "canceled", "completed", "pending"];

export default function AdminAppointmentsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState("table");
  const [page, setPage] = React.useState(1);
  const [appointments, setAppointments] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const loadAppointments = React.useCallback(async () => {
    setLoading(true);
    const result = await getAdminAppointments({
      page,
      limit: 20,
      status: statusFilter === "all" ? "" : statusFilter,
    });
    setAppointments(result.data || []);
    setPagination(
      result.pagination || { page: 1, pages: 1, total: 0, limit: 20 },
    );
    setLoading(false);
  }, [page, statusFilter]);

  React.useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const onStatusChange = async (appointmentId, status) => {
    const updated = await updateAppointmentStatus(appointmentId, status);
    if (!updated) return;

    toast.success(t("admin.appointments.statusUpdated"));
    setAppointments((prev) =>
      prev.map((item) => (item.id === appointmentId ? updated : item)),
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("admin.sidebar.appointments")}
      </h1>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setViewMode("table")}
          className="rounded-full px-4 py-2 text-sm"
          style={{
            background:
              viewMode === "table"
                ? "var(--color-primary)"
                : "var(--color-bg-tertiary)",
            color: viewMode === "table" ? "white" : "var(--color-text-primary)",
          }}
        >
          Table View
        </button>
        <button
          type="button"
          onClick={() => setViewMode("calendar")}
          className="rounded-full px-4 py-2 text-sm"
          style={{
            background:
              viewMode === "calendar"
                ? "var(--color-primary)"
                : "var(--color-bg-tertiary)",
            color:
              viewMode === "calendar" ? "white" : "var(--color-text-primary)",
          }}
        >
          Calendar View
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setPage(1);
              setStatusFilter(item);
            }}
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background:
                statusFilter === item
                  ? "var(--color-primary)"
                  : "var(--color-bg-tertiary)",
              color:
                statusFilter === item ? "white" : "var(--color-text-primary)",
            }}
          >
            {item === "all"
              ? t("booking.all")
              : t(
                  `booking.status${item.charAt(0).toUpperCase()}${item.slice(1)}`,
                  item,
                )}
          </button>
        ))}
      </div>

      {viewMode === "calendar" ? (
        <AppointmentCalendar appointments={appointments} />
      ) : (
        <div className="card-surface overflow-x-auto rounded-xl p-3">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <th className="px-2 py-2 text-left">
                  {t("admin.sidebar.patients")}
                </th>
                <th className="px-2 py-2 text-left">
                  {t("admin.sidebar.doctors")}
                </th>
                <th className="px-2 py-2 text-left">{t("admin.table.date")}</th>
                <th className="px-2 py-2 text-left">
                  {t("admin.table.status")}
                </th>
                <th className="px-2 py-2 text-left">
                  {t("admin.table.phone")}
                </th>
                <th className="px-2 py-2 text-left">
                  {t("admin.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-2 py-4 text-center"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {t("admin.table.noData")}
                  </td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="px-2 py-3">
                      {item?.user?.name || item.userName || "-"}
                    </td>
                    <td className="px-2 py-3">{item?.doctor?.name || "-"}</td>
                    <td className="px-2 py-3">
                      {item.date} {item.time}
                    </td>
                    <td className="px-2 py-3">{item.status}</td>
                    <td className="px-2 py-3">
                      {item.phone || item?.user?.phone || "-"}
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          onStatusChange(item.id, event.target.value)
                        }
                        className="rounded-md border px-2 py-1"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="canceled">canceled</option>
                        <option value="completed">completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
          className="rounded-md border px-3 py-1.5 disabled:opacity-60"
          style={{ borderColor: "var(--color-border)" }}
        >
          {t("admin.table.previous")}
        </button>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {pagination.page} / {pagination.pages}
        </p>
        <button
          type="button"
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, pagination.pages || 1))
          }
          disabled={page >= (pagination.pages || 1)}
          className="rounded-md border px-3 py-1.5 disabled:opacity-60"
          style={{ borderColor: "var(--color-border)" }}
        >
          {t("admin.table.next")}
        </button>
      </div>
    </div>
  );
}

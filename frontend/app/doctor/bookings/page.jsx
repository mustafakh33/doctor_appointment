"use client";

import React from "react";
import { BookOpen, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";
import { toast } from "sonner";
import PageHeader, {
  EmptyState,
  LoadingSkeleton,
} from "../_components/DoctorPageComponents";

const SAMPLE_BOOKINGS = [
  {
    id: 1,
    patient: "Ahmed Ali",
    date: "2026-04-10",
    time: "10:00 AM",
    status: "confirmed",
    phone: "01012345678",
  },
  {
    id: 2,
    patient: "Fatima Hassan",
    date: "2026-04-10",
    time: "11:00 AM",
    status: "pending",
    phone: "01123456789",
  },
  {
    id: 3,
    patient: "Mohamed Ibrahim",
    date: "2026-04-11",
    time: "02:00 PM",
    status: "confirmed",
    phone: "01234567890",
  },
  {
    id: 4,
    patient: "Hana Ahmed",
    date: "2026-04-11",
    time: "03:00 PM",
    status: "canceled",
    phone: "01345678901",
  },
];

const statusConfig = {
  confirmed: { bg: "#e8f4ff", color: "var(--color-info)", label: "Confirmed" },
  pending: {
    bg: "var(--color-primary-50)",
    color: "var(--color-primary)",
    label: "Pending",
  },
  canceled: { bg: "#fde8e8", color: "var(--color-error)", label: "Canceled" },
};

export default function BookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = React.useState(SAMPLE_BOOKINGS);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState("all");

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status:
                  action === "accept"
                    ? "confirmed"
                    : action === "cancel"
                      ? "canceled"
                      : b.status,
              }
            : b,
        ),
      );
      toast.success(`Booking ${action}ed successfully`);
    } catch (error) {
      toast.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Bookings"
        subtitle="Manage all appointments"
        icon={BookOpen}
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {["all", "confirmed", "pending", "canceled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition"
            style={{
              background:
                filter === s
                  ? "var(--color-primary)"
                  : "var(--color-bg-secondary)",
              color: filter === s ? "white" : "var(--color-text-primary)",
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings"
          description={`No ${filter} bookings found`}
        />
      ) : (
        <div
          className="overflow-x-auto rounded-2xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "var(--color-bg-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Patient
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Date
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Time
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const cfg = statusConfig[booking.status];
                return (
                  <tr
                    key={booking.id}
                    style={{ borderColor: "var(--color-border)" }}
                    className="border-t"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {booking.patient}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {booking.phone}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {booking.date}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {booking.time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleAction(booking.id, "accept")}
                              className="px-3 py-1 text-xs rounded-lg"
                              style={{
                                background: "var(--color-success)",
                                color: "white",
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleAction(booking.id, "reject")}
                              className="px-3 py-1 text-xs rounded-lg"
                              style={{
                                background: "var(--color-error)",
                                color: "white",
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            onClick={() => handleAction(booking.id, "cancel")}
                            className="px-3 py-1 text-xs rounded-lg"
                            style={{
                              background: "var(--color-error)",
                              color: "white",
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

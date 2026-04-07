"use client";

import React, { useState } from "react";
import { Bell, Trash2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { toast } from "sonner";
import PageHeader, { EmptyState } from "../_components/DoctorPageComponents";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Booking",
    message: "Ahmed Ali has requested an appointment",
    date: "2026-04-08T14:30",
    read: false,
    type: "booking",
  },
  {
    id: 2,
    title: "Booking Confirmed",
    message: "Your appointment with Fatima Hassan is confirmed for today",
    date: "2026-04-08T10:15",
    read: false,
    type: "confirmed",
  },
  {
    id: 3,
    title: "Booking Canceled",
    message: "Mohamed Ibrahim canceled his appointment",
    date: "2026-04-07T16:45",
    read: true,
    type: "canceled",
  },
  {
    id: 4,
    title: "New Review",
    message: "Hana Ahmed left a 5-star review",
    date: "2026-04-07T09:20",
    read: true,
    type: "review",
  },
  {
    id: 5,
    title: "Schedule Reminder",
    message: "You have 3 appointments today",
    date: "2026-04-08T08:00",
    read: false,
    type: "reminder",
  },
];

const NotificationBadge = ({ type }) => {
  const typeConfig = {
    booking: { bg: "var(--color-primary)", text: "New" },
    confirmed: { bg: "#10B981", text: "Confirmed" },
    canceled: { bg: "#EF4444", text: "Canceled" },
    review: { bg: "#F59E0B", text: "Review" },
    reminder: { bg: "#8B5CF6", text: "Reminder" },
  };

  const config = typeConfig[type] || typeConfig.booking;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ background: config.bg }}
    >
      {config.text}
    </span>
  );
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        icon={Bell}
      />

      {notifications.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors ${
              filter === "all" ? "bg-opacity-100" : "bg-opacity-0"
            }`}
            style={{
              background:
                filter === "all" ? "var(--color-primary)" : "transparent",
              borderColor: "var(--color-border)",
              color: filter === "all" ? "white" : "var(--color-text-primary)",
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors`}
            style={{
              background:
                filter === "unread" ? "var(--color-primary)" : "transparent",
              borderColor: "var(--color-border)",
              color:
                filter === "unread" ? "white" : "var(--color-text-primary)",
            }}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg font-semibold border transition-colors ml-auto"
              style={{
                background: "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              Mark all as read
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            filter === "unread" ? "No unread notifications" : "No notifications"
          }
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border p-4 transition-colors ${!notif.read ? "border-opacity-100" : "border-opacity-50"}`}
              style={{
                background: notif.read
                  ? "transparent"
                  : "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => {
                if (!notif.read) handleMarkAsRead(notif.id);
              }}
            >
              <div className="flex items-start gap-4">
                {!notif.read && (
                  <div
                    className="h-3 w-3 rounded-full mt-2.5"
                    style={{ background: "var(--color-primary)" }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {notif.title}
                        </h3>
                        <NotificationBadge type={notif.type} />
                      </div>
                      <p style={{ color: "var(--color-text-primary)" }}>
                        {notif.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      className="hover:opacity-75 transition-opacity"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {timeAgo(notif.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

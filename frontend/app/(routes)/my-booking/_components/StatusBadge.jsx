"use client";

import { CheckCircle, Clock, XCircle, CheckSquare } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

const statusConfig = {
  confirmed: {
    labelKey: "booking.statusConfirmed",
    color: "var(--color-success)",
    bgColor: "#e6f9ee",
    icon: CheckCircle,
  },
  pending: {
    labelKey: "booking.statusPending",
    color: "var(--color-warning)",
    bgColor: "#fef3e2",
    icon: Clock,
  },
  canceled: {
    labelKey: "booking.statusCanceled",
    color: "var(--color-error)",
    bgColor: "#fde8e8",
    icon: XCircle,
  },
  completed: {
    labelKey: "booking.statusCompleted",
    color: "var(--color-info)",
    bgColor: "#e3f2fd",
    icon: CheckSquare,
  },
};

function StatusBadge({ status }) {
  const { t } = useLanguage();
  const config = statusConfig[status] || statusConfig.confirmed;
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {t(config.labelKey)}
    </span>
  );
}

export default StatusBadge;

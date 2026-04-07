"use client";

import { AlertCircle } from "lucide-react";

export default function PageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="space-y-2 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {Icon && (
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: "var(--color-primary-50)",
                  color: "var(--color-primary)",
                }}
              >
                <Icon className="h-5 w-5" />
              </span>
            )}
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-lg animate-pulse"
          style={{ background: "var(--color-bg-secondary)" }}
        />
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      className="rounded-2xl border border-dashed p-8 md:p-12 text-center"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border)",
      }}
    >
      {Icon && (
        <span
          className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            color: "var(--color-primary)",
            background: "var(--color-primary-50)",
          }}
        >
          <Icon className="h-8 w-8" />
        </span>
      )}

      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, description, action }) {
  return (
    <div
      className="rounded-2xl border p-6 md:p-8"
      style={{
        background: "var(--color-primary-50)",
        borderColor: "var(--color-primary-light)",
      }}
    >
      <div className="flex gap-4">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
          style={{
            color: "var(--color-error)",
            background: "#fde8e8",
          }}
        >
          <AlertCircle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "var(--color-primary)",
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </p>
          <p
            className="mt-2 text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {value}
          </p>
        </div>
        {Icon && (
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              color: color,
              background: "var(--color-bg-secondary)",
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}

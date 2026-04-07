"use client";

import React from "react";

function DoctorPageLayout({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-[28px] border"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-bg-primary) 96%, white) 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex flex-col gap-5 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            {eyebrow ? (
              <p
                className="text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: "var(--color-primary)" }}
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              className="text-3xl font-bold tracking-tight md:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className="max-w-2xl text-sm leading-7 md:text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      </section>

      {children}
    </div>
  );
}

export default DoctorPageLayout;

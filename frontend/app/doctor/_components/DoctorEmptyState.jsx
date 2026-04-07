"use client";

function DoctorEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border)",
      }}
    >
      {Icon ? (
        <span
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            color: "var(--color-primary)",
            background: "var(--color-primary-50)",
          }}
        >
          <Icon className="h-7 w-7" />
        </span>
      ) : null}

      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 max-w-md text-sm leading-7"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default DoctorEmptyState;

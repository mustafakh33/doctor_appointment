import { useLanguage } from "@/app/_context/LanguageContext";

function CategoriesHeader({ count }) {
  const { t } = useLanguage();
  return (
    <section
      className="rounded-3xl p-8 md:p-10"
      style={{
        background:
          "linear-gradient(125deg, var(--color-primary-50), var(--color-secondary-light))",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
            style={{
              background: "var(--color-bg-primary)",
              color: "var(--color-primary)",
            }}
          >
            {t("nav.categories", "Categories")}
          </span>
          <h1
            className="mt-3 text-3xl font-extrabold md:text-5xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("categories.title")}
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm md:text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("categories.subtitle")}
          </p>
        </div>

        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Available Specialties
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {count}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CategoriesHeader;

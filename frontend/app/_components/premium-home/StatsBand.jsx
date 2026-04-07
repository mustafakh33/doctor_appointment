import { useLanguage } from "@/app/_context/LanguageContext";

const stats = [
  { value: "25k+", labelKey: "premiumHome.stats.specialists" },
  { value: "1.2M", labelKey: "premiumHome.stats.consults" },
  { value: "98%", labelKey: "premiumHome.stats.satisfaction" },
  { value: "140+", labelKey: "premiumHome.stats.departments" },
];

function StatsBand() {
  const { t } = useLanguage();

  return (
    <section
      className="px-5 py-10 md:px-20"
      style={{ background: "var(--color-bg-hero)" }}
    >
      <div
        className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4"
        style={{ color: "var(--color-text-inverse)" }}
      >
        {stats.map((stat) => (
          <div key={stat.labelKey} className="text-center lg:text-left">
            <p className="text-4xl font-semibold tracking-tight md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/80">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsBand;

import { CalendarDays, Search, Video } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

const steps = [
  {
    id: "1",
    titleKey: "premiumHome.journey.steps.1.title",
    descriptionKey: "premiumHome.journey.steps.1.description",
    icon: Search,
  },
  {
    id: "2",
    titleKey: "premiumHome.journey.steps.2.title",
    descriptionKey: "premiumHome.journey.steps.2.description",
    icon: CalendarDays,
  },
  {
    id: "3",
    titleKey: "premiumHome.journey.steps.3.title",
    descriptionKey: "premiumHome.journey.steps.3.description",
    icon: Video,
  },
];

function JourneySection() {
  const { t } = useLanguage();

  return (
    <section
      className="px-5 py-18 md:px-20 md:py-20"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div className="mx-auto max-w-7xl">
        <h2
          className="text-center text-4xl font-semibold tracking-tight md:text-5xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("premiumHome.journey.title")}
        </h2>
        <p
          className="mx-auto mt-3 max-w-3xl text-center text-sm leading-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("premiumHome.journey.subtitle")}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.id} className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: "var(--color-primary-light)" }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="mt-5 text-xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {step.id}. {t(step.titleKey)}
                </h3>
                <p
                  className="mx-auto mt-3 max-w-xs text-sm leading-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t(step.descriptionKey)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default JourneySection;

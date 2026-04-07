"use client";

import { Calendar, Search, Shield, Star } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: t("whyChoose.cards.search.title"),
      description: t("whyChoose.cards.search.description"),
    },
    {
      icon: Star,
      title: t("whyChoose.cards.reviews.title"),
      description: t("whyChoose.cards.reviews.description"),
    },
    {
      icon: Calendar,
      title: t("whyChoose.cards.booking.title"),
      description: t("whyChoose.cards.booking.description"),
    },
    {
      icon: Shield,
      title: t("whyChoose.cards.secure.title"),
      description: t("whyChoose.cards.secure.description"),
    },
  ];

  return (
    <section
      className="section-shell"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-20">
        <h2
          className="text-center text-3xl font-bold md:text-4xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("whyChoose.title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "var(--color-secondary-light)" }}
                >
                  <Icon
                    className="h-7 w-7"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="mt-4 text-lg font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

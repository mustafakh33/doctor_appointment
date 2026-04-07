import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

const testimonials = [
  {
    nameKey: "premiumHome.testimonials.items.1.name",
    roleKey: "premiumHome.testimonials.items.1.role",
    dateKey: "premiumHome.testimonials.items.1.date",
    reviewKey: "premiumHome.testimonials.items.1.review",
    rating: 5,
    initials: "JB",
    tint: "var(--color-primary-light)",
  },
  {
    nameKey: "premiumHome.testimonials.items.2.name",
    roleKey: "premiumHome.testimonials.items.2.role",
    dateKey: "premiumHome.testimonials.items.2.date",
    reviewKey: "premiumHome.testimonials.items.2.review",
    rating: 5,
    initials: "ME",
    tint: "color-mix(in srgb, var(--color-secondary) 30%, var(--color-surface-1))",
  },
  {
    nameKey: "premiumHome.testimonials.items.3.name",
    roleKey: "premiumHome.testimonials.items.3.role",
    dateKey: "premiumHome.testimonials.items.3.date",
    reviewKey: "premiumHome.testimonials.items.3.review",
    rating: 4,
    initials: "KS",
    tint: "color-mix(in srgb, var(--color-warning) 28%, var(--color-surface-1))",
  },
];

function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section
      className="px-5 py-16 md:px-20 md:py-20"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div className="mx-auto max-w-7xl">
        <h2
          className="text-[38px] font-semibold tracking-tight md:text-5xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("premiumHome.testimonials.title")}
        </h2>
        <p
          className="mt-3 max-w-3xl text-sm leading-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("premiumHome.testimonials.subtitle")}
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.nameKey}
              className="rounded-3xl p-6 transition hover:-translate-y-1"
              style={{
                background: "var(--color-surface-1)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <Quote
                  className="h-8 w-8"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "var(--color-star)" }}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-3.5 w-3.5"
                      style={{
                        color:
                          index < item.rating
                            ? "var(--color-star)"
                            : "color-mix(in srgb, var(--color-star) 45%, var(--color-surface-1))",
                        fill:
                          index < item.rating
                            ? "var(--color-star)"
                            : "transparent",
                      }}
                    />
                  ))}
                </span>
              </div>

              <p
                className="mt-4 text-base leading-8"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t(item.reviewKey)}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    background: item.tint,
                  }}
                >
                  {item.initials}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t(item.nameKey)}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {t(item.roleKey)}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t(item.dateKey)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

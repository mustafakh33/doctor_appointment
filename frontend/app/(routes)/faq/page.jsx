"use client";

import { useLanguage } from "@/app/_context/LanguageContext";

export default function FAQPage() {
  const { t } = useLanguage();

  const faqItems = Array.from({ length: 8 }, (_, index) => ({
    question: t(`faq.items.q${index + 1}`),
    answer: t(`faq.items.a${index + 1}`),
  }));

  return (
    <div className="page-shell md:px-20">
      <section
        className="rounded-2xl p-8"
        style={{ background: "var(--color-primary-50)" }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("faq.title")}
        </h1>
        <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
          {t("faq.subtitle")}
        </p>
      </section>

      <section className="mt-8 space-y-3">
        {faqItems.map((item) => (
          <details key={item.question} className="card-surface p-5">
            <summary
              className="cursor-pointer list-none text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.question}
            </summary>
            <p
              className="mt-3 leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.answer}
            </p>
          </details>
        ))}
      </section>
    </div>
  );
}

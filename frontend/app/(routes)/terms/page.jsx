"use client";

import { useLanguage } from "@/app/_context/LanguageContext";

function PolicyBlock({ title, text }) {
  return (
    <article className="card-surface p-6">
      <h2
        className="text-xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="mt-3 leading-7"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {text}
      </p>
    </article>
  );
}

export default function TermsPage() {
  const { t } = useLanguage();

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
          {t("terms.title")}
        </h1>
        <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
          {t("terms.subtitle")}
        </p>
      </section>

      <div className="mt-8 space-y-4">
        <PolicyBlock title={t("terms.tosTitle")} text={t("terms.tosText")} />
        <PolicyBlock
          title={t("terms.privacyTitle")}
          text={t("terms.privacyText")}
        />
        <PolicyBlock
          title={t("terms.cookieTitle")}
          text={t("terms.cookieText")}
        />
      </div>
    </div>
  );
}

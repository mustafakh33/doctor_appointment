"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: ShieldCheck,
      title: t("about.values.trust"),
      description: t("about.values.trustDesc"),
    },
    {
      icon: Lightbulb,
      title: t("about.values.innovation"),
      description: t("about.values.innovationDesc"),
    },
    {
      icon: HeartPulse,
      title: t("about.values.patientFirst"),
      description: t("about.values.patientFirstDesc"),
    },
  ];

  const highlights = [
    {
      icon: Users,
      title: t("about.values.patientFirst"),
      description: t("about.subtitle"),
    },
    {
      icon: Stethoscope,
      title: t("about.values.trust"),
      description: t("about.storyTitle"),
    },
    {
      icon: Building2,
      title: t("about.partnersTitle"),
      description: t("about.partnersText"),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <section
        className="relative overflow-hidden rounded-3xl p-8 text-white md:p-12"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(134, 242, 228, 0.22), transparent 32%), radial-gradient(circle at 88% 22%, rgba(255, 255, 255, 0.2), transparent 38%), var(--color-bg-hero)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div className="grid items-start gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              {t("about.storyTitle")}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
              {t("about.title")}
            </h1>
            <p
              className="mt-4 max-w-2xl text-base leading-7 md:text-lg"
              style={{ color: "rgba(255, 255, 255, 0.85)" }}
            >
              {t("about.subtitle")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/auth/register">
                <Button
                  className="h-11 rounded-full px-6 text-sm font-semibold text-white"
                  style={{ background: "var(--color-accent)" }}
                >
                  {t("about.ctaButton")}
                </Button>
              </Link>
              <Link href="/contact-us">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-white/45 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  {t("nav.contactUs")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold md:text-base">
                        {item.title}
                      </h3>
                      <p
                        className="mt-1 text-xs leading-6 md:text-sm"
                        style={{ color: "rgba(255, 255, 255, 0.82)" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="card-surface rounded-3xl p-7 md:p-8">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("about.storyTitle")}
          </h2>
          <p
            className="mt-4 text-sm leading-7 md:text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("about.storyText")}
          </p>
        </article>

        <article
          className="rounded-3xl p-7 md:p-8"
          style={{
            background:
              "linear-gradient(145deg, var(--color-secondary-light), var(--color-primary-50))",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("about.partnersTitle")}
          </h2>
          <p
            className="mt-4 text-sm leading-7 md:text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("about.partnersText")}
          </p>
        </article>
      </section>

      <section className="mt-8">
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("about.valuesTitle")}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="card-surface rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "var(--color-secondary-light)" }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="mt-4 text-lg font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="mt-8 rounded-3xl p-8 text-center md:p-10"
        style={{
          background:
            "linear-gradient(120deg, var(--color-primary-50), var(--color-secondary-light))",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-2xl font-bold md:text-3xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("about.ctaTitle")}
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-sm md:text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("about.subtitle")}
        </p>
        <Link href="/auth/register" className="mt-6 inline-flex">
          <Button
            className="h-11 rounded-full px-6 text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {t("about.ctaButton")}
          </Button>
        </Link>
      </section>
    </div>
  );
}

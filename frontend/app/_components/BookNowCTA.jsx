"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";

function BookNowCTA() {
  const { t } = useLanguage();

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-14 text-center md:px-10"
          style={{ background: "var(--color-bg-hero)" }}
        >
          <div
            className="pointer-events-none absolute -top-16 -left-10 h-44 w-44 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="pointer-events-none absolute -right-8 -bottom-16 h-52 w-52 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              {t("clinic.ctaTitle")}
            </h2>
            <p className="mt-3 text-base text-white/90 md:text-lg">
              {t("clinic.ctaSubtitle")}
            </p>

            <div className="mt-8">
              <Link href="/doctors">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base font-semibold text-white"
                  style={{ background: "var(--color-accent)" }}
                >
                  {t("clinic.ctaButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookNowCTA;

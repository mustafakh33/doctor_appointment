"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";

function TrustSection() {
  const { t } = useLanguage();

  const bullets = [
    t("trust.verifiedDoctors"),
    t("trust.easyBooking"),
    t("trust.compareDoctors"),
  ];

  return (
    <section className="section-shell bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 md:items-center md:px-20">
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-white"
          style={{
            background: "var(--color-bg-hero)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-white/20" />
          <div
            className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full"
            style={{ background: "rgba(255,107,107,0.3)" }}
          />
          <Image
            src="/assets/img/trust-section.png"
            alt={t("sections.lookingForDoctor")}
            width={700}
            height={500}
            className="relative z-10 h-[280px] w-full rounded-xl object-cover"
          />
        </div>

        <div className="space-y-5">
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("sections.lookingForDoctor")}
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {t("trust.description")}
          </p>

          <ul className="space-y-3">
            {bullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                <CheckCircle
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-secondary-dark)" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button
            className="rounded-full px-7 text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {t("trust.findDoctor")}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;

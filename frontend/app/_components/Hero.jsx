"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: "var(--color-bg-hero)" }}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-16 top-16 h-24 w-24 animate-pulse rounded-full bg-mint/20" />
        <div className="absolute bottom-20 left-1/3 h-14 w-14 rounded-full bg-mint/20" />
        <div className="absolute right-20 top-24 h-20 w-20 rounded-full bg-mint/20" />
      </div>

      <div className="mx-auto grid min-h-[500px] max-w-7xl grid-cols-1 gap-10 px-5 py-14 md:min-h-[600px] md:grid-cols-[55%_45%] md:items-center md:px-20">
        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="italic">{t("hero.titleBold")}</span>{" "}
            <span style={{ color: "var(--color-secondary)" }}>
              {t("hero.titleAccent")}
            </span>{" "}
            {t("hero.titleEnd")}
          </h1>

          <p
            className="mt-4 max-w-lg"
            style={{ color: "var(--color-primary-light)" }}
          >
            {t("hero.subtitle")}
          </p>

          <div
            className="mt-8 rounded-2xl bg-white p-2"
            style={{ boxShadow: "var(--shadow-xl)" }}
          >
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={t("hero.searchPlaceholder")}
                  className="h-12 rounded-xl border-0 ps-10 shadow-none"
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={t("hero.locationPlaceholder")}
                  className="h-12 rounded-xl border-0 ps-10 shadow-none"
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
              <Link href="/explore">
                <Button
                  className="h-12 w-full rounded-xl px-8 font-semibold text-white md:w-auto"
                  style={{ background: "var(--color-accent)" }}
                >
                  {t("hero.searchButton")}
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="mt-6 flex flex-wrap items-center gap-4 text-sm md:gap-6"
            style={{ color: "var(--color-primary-light)" }}
          >
            <span>{t("hero.statsDoctors")}</span>
            <span className="hidden h-4 w-px bg-white/50 md:block" />
            <span>{t("hero.statsClinics")}</span>
            <span className="hidden h-4 w-px bg-white/50 md:block" />
            <span>{t("hero.statsPatients")}</span>
          </div>
        </div>

        <div className="relative z-10 hidden md:block">
          <div className="absolute -inset-4 rounded-[40px] bg-white/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl">
            <Image
              src="/assets/img/hero.png"
              width={900}
              height={1000}
              alt={t("hero.imageAlt")}
              className="h-[470px] w-full rounded-xl object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hero-wave h-20 w-full bg-white" />
    </section>
  );
}

export default Hero;

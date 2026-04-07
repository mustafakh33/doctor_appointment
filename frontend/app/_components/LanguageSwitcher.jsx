"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, toggleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("common.switchLanguage")}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
      style={{
        color: "var(--color-primary)",
        borderColor: "var(--color-border)",
        background: "var(--color-primary-50)",
      }}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "en" ? "عربي" : "English"}</span>
    </button>
  );
}

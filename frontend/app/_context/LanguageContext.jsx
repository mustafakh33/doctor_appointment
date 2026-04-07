"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import en from "@/app/_locales/en.json";
import ar from "@/app/_locales/ar.json";

const translations = { en, ar };
const STORAGE_KEY = "doccura-lang";
const LanguageContext = createContext(null);

const interpolate = (value, params) => {
  if (!params || typeof value !== "string") return value;
  return Object.entries(params).reduce((acc, [key, paramValue]) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(paramValue));
  }, value);
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") {
      setLocale(saved);
    }

    setIsLocaleReady(true);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !isLocaleReady) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [isLocaleReady, locale]);

  const toggleLanguage = useCallback(() => {
    setLocale((previous) => (previous === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key, fallback, params) => {
      const keys = key.split(".");
      let value = translations[locale];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return interpolate(fallback || key, params);
        }
      }

      if (typeof value !== "string") {
        return interpolate(fallback || key, params);
      }

      return interpolate(value, params);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLanguage,
      t,
      dir: locale === "ar" ? "rtl" : "ltr",
      isRTL: locale === "ar",
    }),
    [locale, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

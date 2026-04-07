"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function ScrollToTop() {
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed z-50 h-11 w-11 rounded-full text-white transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"} ${isRTL ? "bottom-6 left-6" : "bottom-6 right-6"}`}
      style={{
        background: "var(--color-primary)",
        boxShadow: "var(--shadow-lg)",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="mx-auto h-5 w-5" />
    </button>
  );
}

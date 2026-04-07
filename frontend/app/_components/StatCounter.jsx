"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Smile, Stethoscope, Star } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

function StatItem({
  icon: Icon,
  label,
  target,
  suffix = "+",
  decimal = false,
  active,
  divider,
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const duration = 2000;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const nextValue = target * progress;
      setValue(nextValue);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, target]);

  return (
    <div
      className={`px-4 py-5 text-center ${divider ? "md:border-r" : ""}`}
      style={{ borderColor: "rgba(255,255,255,0.25)" }}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-4xl font-bold">
        {decimal ? value.toFixed(1) : Math.round(value).toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm" style={{ color: "#dbe7f5" }}>
        {label}
      </p>
    </div>
  );
}

function StatCounter() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Stethoscope, label: t("stats.doctors"), target: 1000, suffix: "+" },
    { icon: Building2, label: t("stats.clinics"), target: 500, suffix: "+" },
    { icon: Smile, label: t("stats.patients"), target: 50000, suffix: "+" },
    {
      icon: Star,
      label: t("stats.rating"),
      target: 4.8,
      suffix: "",
      decimal: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-shell text-white"
      style={{ background: "var(--color-primary)" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 px-5 md:grid-cols-4 md:px-20">
        {stats.map((stat, index) => (
          <StatItem
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            target={stat.target}
            suffix={stat.suffix}
            decimal={stat.decimal}
            active={visible}
            divider={index < stats.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

export default StatCounter;

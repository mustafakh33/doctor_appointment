import Link from "next/link";
import { BriefcaseMedical, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

function DoctorCtaSection() {
  const { t } = useLanguage();

  return (
    <section
      className="px-5 pb-10 pt-4 md:px-20 md:pb-14 md:pt-6"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <div
        className="mx-auto max-w-7xl rounded-[28px] px-6 py-10 text-white md:px-10 md:py-12"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--color-secondary) 22%, transparent), transparent 26%), var(--color-bg-hero)",
        }}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              {t("premiumHome.cta.badge")}
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {t("premiumHome.cta.titleLine1")}
              <br />
              {t("premiumHome.cta.titleLine2")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              {t("premiumHome.cta.subtitle")}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, labelKey: "premiumHome.cta.benefits.1" },
                { icon: ShieldCheck, labelKey: "premiumHome.cta.benefits.2" },
                {
                  icon: BriefcaseMedical,
                  labelKey: "premiumHome.cta.benefits.3",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.labelKey}
                    className="rounded-2xl border border-white/15 bg-white/8 p-4 text-sm text-white/85 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5 text-white/90" />
                    <p className="mt-2 leading-6">{t(item.labelKey)}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="theme-btn-primary inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold shadow-[0_14px_30px_rgba(0,80,203,0.35)] transition hover:-translate-y-px"
              >
                {t("premiumHome.cta.primaryButton")}
              </Link>
              <Link
                href="/doctor"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10"
              >
                {t("premiumHome.cta.secondaryButton")}
              </Link>
            </div>
          </div>

          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-white/6 ring-1 ring-white/12 md:h-56 md:w-56">
            <BriefcaseMedical className="h-14 w-14 text-white/70 md:h-16 md:w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorCtaSection;

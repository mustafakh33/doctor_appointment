"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/_context/LanguageContext";

function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: t("nav.home", "Home"), href: "/" },
    { label: t("nav.doctors", "Doctors"), href: "/doctors" },
    { label: t("nav.categories", "Specialties"), href: "/categories" },
    { label: t("nav.about", "About"), href: "/about" },
    { label: t("nav.contactUs", "Contact"), href: "/contact-us" },
  ];

  const patientLinks = [
    {
      label: t("footer.patients.bookAppointment", "Book Appointment"),
      href: "/explore",
    },
    {
      label: t("footer.patients.myAppointments", "My Appointments"),
      href: "/dashboard?tab=bookings",
    },
    {
      label: t("sections.selectSpecialty", "Find by Specialty"),
      href: "/search/general",
    },
  ];

  const supportLinks = [
    { label: t("footer.supportLinks.faq", "FAQ"), href: "/faq" },
    {
      label: t("footer.supportLinks.privacy", "Terms & Privacy"),
      href: "/terms",
    },
    { label: t("auth.signIn", "Sign In"), href: "/auth/login" },
    {
      label: t("auth.register", "Create Account"),
      href: "/auth/register",
    },
  ];

  const linkGroups = [
    { title: t("footer.quickLinks", "Quick Links"), links: quickLinks },
    { title: t("footer.forPatients", "For Patients"), links: patientLinks },
    { title: t("footer.support", "Support"), links: supportLinks },
  ];

  return (
    <footer
      className="pb-8 pt-14 text-white md:pt-16"
      style={{
        background: "var(--color-footer-bg)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.2fr_2fr] lg:gap-12">
          <section className="max-w-md">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight"
            >
              {t("brand.name")}
            </Link>
            <p
              className="mt-4 text-sm leading-7"
              style={{ color: "rgba(255, 255, 255, 0.78)" }}
            >
              {t("footer.description")}
            </p>
            <Link
              href="/doctors"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              {t("common.search", "Search")}
            </Link>
          </section>

          <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255, 255, 255, 0.72)" }}
                >
                  {group.title}
                </h4>
                <ul
                  className="mt-4 space-y-3 text-sm"
                  style={{ color: "rgba(255, 255, 255, 0.86)" }}
                >
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="inline-block transition hover:text-white hover:opacity-100"
                        style={{ opacity: 0.96 }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        <div
          className="mt-6 flex items-center justify-center text-center text-sm md:justify-between md:text-start"
          style={{
            color: "rgba(255, 255, 255, 0.68)",
          }}
        >
          <p>{t("footer.copyright", undefined, { year })}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

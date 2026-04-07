"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import {
  CheckCircle2,
  Search,
  Sparkles,
  Stethoscope,
  MapPin,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";

function HeroSection({
  heroDoctor,
  doctors = [],
  specialties = [],
  locations = [],
  onSearch,
}) {
  const { t } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const deferredLocationQuery = useDeferredValue(locationQuery);

  const locationSuggestions = useMemo(() => {
    const query = deferredLocationQuery.trim().toLowerCase();
    const uniqueLocations = [...new Set(locations.filter(Boolean))];
    if (!query) return uniqueLocations.slice(0, 5);
    return uniqueLocations
      .filter((location) => location.toLowerCase().includes(query))
      .slice(0, 5);
  }, [deferredLocationQuery, locations]);

  const topDoctors = useMemo(() => {
    const query = deferredLocationQuery.trim().toLowerCase();
    return doctors
      .filter((doctor) => {
        const specialtyMatch =
          !selectedSpecialty || doctor?.specialty === selectedSpecialty;
        const locationMatch =
          !query || doctor?.location?.toLowerCase().includes(query);
        return specialtyMatch && locationMatch;
      })
      .slice(0, 3);
  }, [deferredLocationQuery, doctors, selectedSpecialty]);

  const specialtyOptions = [...new Set(specialties.filter(Boolean))];

  return (
    <section className="hero-section">
      {/* Ambient background blobs */}
      <div className="hero-bg-blob hero-bg-blob--1" />
      <div className="hero-bg-blob hero-bg-blob--2" />
      <div className="hero-bg-blob hero-bg-blob--3" />
      {/* Subtle dot-grid overlay */}
      <div className="hero-dot-grid" />

      <div className="hero-inner">
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="hero-left">
          {/* Badge */}
          <span className="hero-badge">
            <Sparkles className="hero-badge__icon" />
            {t("premiumHome.hero.badge")}
          </span>

          {/* Headline */}
          <h1 className="hero-title">
            {t("premiumHome.hero.titleLine1")}
            <br />
            <span className="hero-title__highlight">
              {t("premiumHome.hero.titleHighlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">{t("premiumHome.hero.subtitle")}</p>

          {/* Search card */}
          <form
            className="hero-search-card"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch({
                specialty: selectedSpecialty,
                location: locationQuery.trim(),
              });
            }}
          >
            <div className="hero-search-fields">
              {/* Specialty */}
              <label className="hero-field">
                <span className="hero-field__label">
                  {t("premiumHome.hero.specialtyLabel")}
                </span>
                <div className="hero-field__input-wrap">
                  <Stethoscope className="hero-field__icon" />
                  <select
                    value={selectedSpecialty}
                    onChange={(event) =>
                      setSelectedSpecialty(event.target.value)
                    }
                    className="hero-select"
                  >
                    <option value="">
                      {t("premiumHome.hero.allSpecialties")}
                    </option>
                    {specialtyOptions.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              {/* Location */}
              <label className="hero-field">
                <span className="hero-field__label">
                  {t("premiumHome.hero.locationLabel")}
                </span>
                <div className="hero-field__input-wrap">
                  <MapPin className="hero-field__icon" />
                  <input
                    type="text"
                    value={locationQuery}
                    onFocus={() => setIsLocationFocused(true)}
                    onBlur={() => {
                      window.setTimeout(() => setIsLocationFocused(false), 140);
                    }}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder={
                      locations[0] || t("premiumHome.hero.locationPlaceholder")
                    }
                    className="hero-input"
                    aria-autocomplete="list"
                    aria-expanded={
                      isLocationFocused && locationSuggestions.length > 0
                    }
                  />

                  {isLocationFocused && locationSuggestions.length > 0 && (
                    <div className="hero-suggestions">
                      {locationSuggestions.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setLocationQuery(location);
                            setIsLocationFocused(false);
                          }}
                          className="hero-suggestions__item"
                        >
                          <span>{location}</span>
                          <ArrowRight className="hero-suggestions__arrow" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Submit */}
              <button type="submit" className="hero-search-btn">
                <Search className="hero-search-btn__icon" />
                {t("premiumHome.hero.searchDoctors")}
              </button>
            </div>

            {/* Trust badges */}
            <div className="hero-trust">
              <span className="hero-trust__badge hero-trust__badge--green">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("premiumHome.hero.verifiedDoctors")}
              </span>
              <span className="hero-trust__badge hero-trust__badge--blue">
                <Clock3 className="h-3.5 w-3.5" />
                {t("premiumHome.hero.sameDayBooking")}
              </span>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div className="hero-right">
          {/* Decorative blobs behind the card */}
          <div className="hero-card-blob hero-card-blob--tl hero-float-slow" />
          <div className="hero-card-blob hero-card-blob--tr hero-float-medium hero-rotate-slow" />
          <div className="hero-card-blob hero-card-blob--bl hero-float-reverse" />
          <div className="hero-card-blob hero-card-blob--br hero-rotate-slower" />

          {/* Doctor card */}
          <div className="hero-doctor-card">
            <Image
              src={heroDoctor?.imageUrl || "/assets/img/hero.png"}
              alt={heroDoctor?.name || t("premiumHome.hero.featuredDoctorAlt")}
              width={820}
              height={920}
              priority
              className="hero-doctor-card__img"
            />

            {/* Gradient overlay */}
            <div className="hero-doctor-card__overlay" />

            {/* Bottom info pill */}
            <div className="hero-doctor-pill">
              <p className="hero-doctor-pill__title">
                <CheckCircle2 className="h-4 w-4" />
                {t("premiumHome.hero.certifiedSpecialists")}
              </p>
              <p className="hero-doctor-pill__sub">
                {t("premiumHome.hero.verifiedConsultations")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";
import { getClinic } from "@/app/_utils/Api";

const initialState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

function ContactUsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const loadClinic = async () => {
      const data = await getClinic();
      setClinic(data);
    };

    loadClinic();
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = t("common.required");
    if (!formData.email.trim()) {
      nextErrors.email = t("common.required");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = t("common.error");
    }
    if (!formData.subject.trim()) nextErrors.subject = t("common.required");
    if (!formData.message.trim()) nextErrors.message = t("common.required");

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    toast.success(t("contact.messageSent"));
    setFormData(initialState);
    setErrors({});
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <div
        className="mb-8 rounded-2xl p-8 text-white"
        style={{ background: "var(--color-bg-hero)" }}
      >
        <h1 className="text-3xl font-bold md:text-4xl">{t("contact.title")}</h1>
        <p
          className="mt-2 max-w-3xl"
          style={{ color: "rgba(255, 255, 255, 0.86)" }}
        >
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border bg-white p-6"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("contact.fullName")}
            </label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t("contact.namePlaceholder")}
            />
            {errors.fullName && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--color-error)" }}
              >
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("contact.email")}
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("contact.emailPlaceholder")}
            />
            {errors.email && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--color-error)" }}
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("contact.subject")}
            </label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t("contact.subjectPlaceholder")}
            />
            {errors.subject && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--color-error)" }}
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("contact.message")}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder={t("contact.messagePlaceholder")}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--color-border)" }}
            />
            {errors.message && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--color-error)" }}
              >
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {t("contact.sendMessage")}
          </Button>
        </form>

        <div
          className="space-y-5 rounded-2xl border bg-white p-6"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("contact.contactInfo")}
          </h2>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--color-primary-50)" }}
            >
              <MapPin
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <p className="font-semibold">{t("doctor.address")}</p>
              <p style={{ color: "var(--color-text-secondary)" }}>
                {clinic?.address || t("contact.address")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--color-primary-50)" }}
            >
              <Phone
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <p className="font-semibold">{t("doctor.phone")}</p>
              <p style={{ color: "var(--color-text-secondary)" }}>
                {clinic?.phone || t("contact.phone")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--color-primary-50)" }}
            >
              <Mail
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <p className="font-semibold">{t("auth.email")}</p>
              <p style={{ color: "var(--color-text-secondary)" }}>
                {clinic?.email || t("contact.emailAddress")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--color-primary-50)" }}
            >
              <MessageCircle
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <p className="font-semibold">{t("clinic.whatsapp")}</p>
              <a
                href={`https://wa.me/${String(clinic?.whatsapp || "+201001234567").replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium"
                style={{ color: "var(--color-success)" }}
              >
                {t("clinic.whatsappDesc")}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--color-primary-50)" }}
            >
              <Clock
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <p className="font-semibold">{t("contact.workingHours")}</p>
              <p style={{ color: "var(--color-text-secondary)" }}>
                {t("contact.weekdays")}
              </p>
              <p style={{ color: "var(--color-text-secondary)" }}>
                {t("contact.weekends")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;

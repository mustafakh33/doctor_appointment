"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BriefcaseMedical,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { getCategories } from "@/app/_utils/Api";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import AuthSplitLayout from "../_components/AuthSplitLayout";
import { getDefaultPathByRole } from "@/app/_utils/roleAccess";

const patientInitialState = {
  name: "",
  name_ar: "",
  email: "",
  phone: "",
  cityArea: "",
  cityArea_ar: "",
  password: "",
  confirmPassword: "",
};

const doctorInitialState = {
  name: "",
  name_ar: "",
  email: "",
  phone: "",
  cityArea: "",
  cityArea_ar: "",
  password: "",
  confirmPassword: "",
  category: "",
  address: "",
  address_ar: "",
  about: "",
  about_ar: "",
  year_of_experience: "",
  appointment_fee: "",
};

const AUTH_IMAGES = {
  chooser: "/assets/img/auth/Choose-Account-Type.png",
  patient: "/assets/img/auth/Patient-create-acount.png",
  doctor: "/assets/img/auth/doctor-create-acount.jpg",
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { t, locale } = useLanguage();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [patientForm, setPatientForm] = useState(patientInitialState);
  const [patientProfileImage, setPatientProfileImage] = useState(null);
  const [doctorForm, setDoctorForm] = useState(doctorInitialState);
  const [doctorProfileImage, setDoctorProfileImage] = useState(null);
  const [doctorCredentials, setDoctorCredentials] = useState([]);

  useEffect(() => {
    const roleParam = String(searchParams.get("role") || "").toLowerCase();
    if (roleParam === "patient" || roleParam === "doctor") {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedRole !== "doctor") return;

    let active = true;

    const loadCategories = async () => {
      const data = await getCategories();
      if (!active) return;
      setCategories(Array.isArray(data) ? data : []);
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [selectedRole]);

  const currentImage = useMemo(() => {
    if (selectedRole === "patient") return AUTH_IMAGES.patient;
    if (selectedRole === "doctor") return AUTH_IMAGES.doctor;
    return AUTH_IMAGES.chooser;
  }, [selectedRole]);

  const currentTitle = useMemo(() => {
    if (selectedRole === "patient") return t("auth.patientFormTitle");
    if (selectedRole === "doctor") return t("auth.doctorFormTitle");
    return t("auth.accountTypeTitle");
  }, [selectedRole, t]);

  const currentSubtitle = useMemo(() => {
    if (selectedRole === "patient") return t("auth.patientFormSubtitle");
    if (selectedRole === "doctor") return t("auth.doctorFormSubtitle");
    return t("auth.accountTypeSubtitle");
  }, [selectedRole, t]);

  const currentImageOverlay = useMemo(() => {
    if (selectedRole === "patient") {
      return "linear-gradient(160deg,rgba(59,130,246,0.62)_0%,rgba(37,99,235,0.72)_48%,rgba(15,23,42,0.72)_100%)";
    }

    if (selectedRole === "doctor") {
      return "linear-gradient(165deg,rgba(30,64,175,0.34)_0%,rgba(37,99,235,0.5)_55%,rgba(15,23,42,0.56)_100%)";
    }

    return "linear-gradient(165deg,rgba(14,116,144,0.42)_0%,rgba(37,99,235,0.6)_55%,rgba(15,23,42,0.58)_100%)";
  }, [selectedRole]);

  const handlePatientChange = (event) => {
    const { name, value } = event.target;
    setPatientForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleDoctorChange = (event) => {
    const { name, value } = event.target;
    setDoctorForm((previous) => ({ ...previous, [name]: value }));
  };

  const handlePatientProfileImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setPatientProfileImage(nextFile);
  };

  const handleDoctorProfileImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setDoctorProfileImage(nextFile);
  };

  const handleDoctorCredentialsChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setDoctorCredentials(nextFiles);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    router.replace(`/auth/register?role=${role}`);
  };

  const resetRole = () => {
    setSelectedRole("");
    setPatientProfileImage(null);
    setDoctorProfileImage(null);
    setDoctorCredentials([]);
    router.replace("/auth/register");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const isDoctor = selectedRole === "doctor";
      let payload;

      if (isDoctor) {
        const formData = new FormData();
        formData.append("name", doctorForm.name);
        formData.append("name_ar", doctorForm.name_ar || "");
        formData.append("email", doctorForm.email);
        formData.append("phone", doctorForm.phone);
        formData.append("cityArea", doctorForm.cityArea || "");
        formData.append("cityArea_ar", doctorForm.cityArea_ar || "");
        formData.append("password", doctorForm.password);
        formData.append("confirmPassword", doctorForm.confirmPassword);
        formData.append("role", "doctor");
        formData.append("category", doctorForm.category);
        formData.append("address", doctorForm.address);
        formData.append("address_ar", doctorForm.address_ar || "");
        formData.append("about", doctorForm.about);
        formData.append("about_ar", doctorForm.about_ar || "");
        formData.append(
          "year_of_experience",
          String(Number(doctorForm.year_of_experience)),
        );
        formData.append(
          "appointment_fee",
          String(Number(doctorForm.appointment_fee)),
        );

        if (doctorProfileImage) {
          formData.append("profileImage", doctorProfileImage);
        }

        doctorCredentials.forEach((file) => {
          formData.append("credentials", file);
        });

        payload = formData;
      } else {
        const formData = new FormData();
        formData.append("name", patientForm.name);
        formData.append("name_ar", patientForm.name_ar || "");
        formData.append("email", patientForm.email);
        formData.append("phone", patientForm.phone || "");
        formData.append("cityArea", patientForm.cityArea || "");
        formData.append("cityArea_ar", patientForm.cityArea_ar || "");
        formData.append("password", patientForm.password);
        formData.append("confirmPassword", patientForm.confirmPassword);
        formData.append("role", "user");

        if (patientProfileImage) {
          formData.append("profileImage", patientProfileImage);
        }

        payload = formData;
      }

      const session = await register(payload);
      toast.success(
        isDoctor ? t("auth.doctorFormTitle") : t("auth.patientFormTitle"),
      );
      router.push(getDefaultPathByRole(session?.user?.role));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const renderRolePicker = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => handleRoleSelect("patient")}
          className="group rounded-[28px] border p-5 text-left transition hover:-translate-y-1"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface-1)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "var(--color-primary-50)",
                color: "var(--color-primary)",
              }}
            >
              <Users className="h-5 w-5" />
            </div>
            <CheckCircle2
              className="h-5 w-5"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <h3
            className="mt-4 text-xl font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("auth.patientAccountTitle")}
          </h3>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("auth.patientAccountDescription")}
          </p>
          <span
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.continue")} <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("doctor")}
          className="group rounded-[28px] border p-5 text-left transition hover:-translate-y-1"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface-1)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "var(--color-bg-secondary)",
                color: "var(--color-info)",
              }}
            >
              <BriefcaseMedical className="h-5 w-5" />
            </div>
            <CheckCircle2
              className="h-5 w-5"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <h3
            className="mt-4 text-xl font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("auth.doctorAccountTitle")}
          </h3>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("auth.doctorAccountDescription")}
          </p>
          <span
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.continue")} <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );

  const renderPatientForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        className="block space-y-2 text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>Full Name (EN)</span>
        <Input
          name="name"
          placeholder={t("auth.fullNamePlaceholder")}
          value={patientForm.name}
          onChange={handlePatientChange}
          className="h-12 rounded-2xl"
          required
        />
      </label>

      <label
        className="block space-y-2 text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>الاسم الكامل (AR)</span>
        <Input
          name="name_ar"
          placeholder="الاسم بالعربي"
          value={patientForm.name_ar}
          onChange={handlePatientChange}
          className="h-12 rounded-2xl"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.email")}</span>
          <Input
            name="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={patientForm.email}
            onChange={handlePatientChange}
            className="h-12 rounded-2xl"
            required
          />
        </label>
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("profile.phone")}</span>
          <Input
            name="phone"
            placeholder={t("auth.phonePlaceholder")}
            value={patientForm.phone}
            onChange={handlePatientChange}
            className="h-12 rounded-2xl"
          />
        </label>
      </div>

      <label
        className="block space-y-2 text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>City / Area (EN)</span>
        <Input
          name="cityArea"
          placeholder={t("auth.cityAreaPlaceholder")}
          value={patientForm.cityArea}
          onChange={handlePatientChange}
          className="h-12 rounded-2xl"
        />
      </label>

      <label
        className="block space-y-2 text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>المدينة / المنطقة (AR)</span>
        <Input
          name="cityArea_ar"
          placeholder="المدينة أو المنطقة بالعربي"
          value={patientForm.cityArea_ar}
          onChange={handlePatientChange}
          className="h-12 rounded-2xl"
        />
      </label>

      <label
        className="block space-y-2 text-sm font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        <span>{t("auth.profileImageLabel")}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handlePatientProfileImageChange}
          className="theme-input h-12 w-full rounded-2xl px-3 py-2"
        />
        {patientProfileImage ? (
          <p
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {patientProfileImage.name}
          </p>
        ) : null}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.password")}</span>
          <Input
            name="password"
            type="password"
            placeholder={t("auth.password")}
            value={patientForm.password}
            onChange={handlePatientChange}
            className="h-12 rounded-2xl"
            required
          />
        </label>
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.confirmPassword")}</span>
          <Input
            name="confirmPassword"
            type="password"
            placeholder={t("auth.confirmPassword")}
            value={patientForm.confirmPassword}
            onChange={handlePatientChange}
            className="h-12 rounded-2xl"
            required
          />
        </label>
      </div>

      <label
        className="flex items-center gap-3 text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <input
          type="checkbox"
          required
          className="h-4 w-4 rounded border"
          style={{ accentColor: "var(--color-primary)" }}
        />
        <span>
          {t("auth.acceptTerms")}{" "}
          <Link
            href="/terms"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.termsOfService")}
          </Link>{" "}
          {locale === "ar" ? "و" : "and"}{" "}
          <Link
            href="/terms"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("terms.privacyTitle")}
          </Link>
          .
        </span>
      </label>

      <Button
        className="w-full rounded-full py-6 text-white"
        style={{ background: "var(--color-accent)" }}
        disabled={loading}
        type="submit"
      >
        {loading ? t("common.loading") : t("auth.createAccount")}
      </Button>
    </form>
  );

  const renderDoctorForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div
        className="space-y-3 rounded-[26px] border p-4"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-bg-secondary)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {t("auth.professionalIdentity")}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>Full Name (EN)</span>
            <Input
              name="name"
              placeholder={t("auth.fullNamePlaceholder")}
              value={doctorForm.name}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>الاسم الكامل (AR)</span>
            <Input
              name="name_ar"
              placeholder="الاسم بالعربي"
              value={doctorForm.name_ar}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.selectSpecialty")}</span>
            <select
              name="category"
              value={doctorForm.category}
              onChange={handleDoctorChange}
              className="theme-input h-12 w-full rounded-2xl px-4"
              required
            >
              <option value="">{t("auth.selectSpecialty")}</option>
              {categories.map((category) => (
                <option
                  key={category.documentId || category.id}
                  value={category.documentId || category.id}
                >
                  {locale === "ar"
                    ? category.name_ar || category.name
                    : category.name || category.name_ar}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.email")}</span>
            <Input
              name="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={doctorForm.email}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("profile.phone")}</span>
            <Input
              name="phone"
              placeholder={t("auth.phonePlaceholder")}
              value={doctorForm.phone}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>City / Area (EN)</span>
            <Input
              name="cityArea"
              placeholder={t("auth.cityAreaPlaceholder")}
              value={doctorForm.cityArea}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>المدينة / المنطقة (AR)</span>
            <Input
              name="cityArea_ar"
              placeholder="المدينة أو المنطقة بالعربي"
              value={doctorForm.cityArea_ar}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.profileImageLabel")}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleDoctorProfileImageChange}
              className="theme-input h-12 w-full rounded-2xl px-3 py-2"
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>
              {t("auth.credentials")} ({t("auth.optional")})
            </span>
            <input
              type="file"
              accept="image/*,.pdf,application/pdf"
              multiple
              onChange={handleDoctorCredentialsChange}
              className="theme-input h-12 w-full rounded-2xl px-3 py-2"
            />
            {doctorCredentials.length ? (
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {doctorCredentials.length} file(s) selected
              </p>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.password")}</span>
            <Input
              name="password"
              type="password"
              placeholder={t("auth.password")}
              value={doctorForm.password}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.confirmPassword")}</span>
            <Input
              name="confirmPassword"
              type="password"
              placeholder={t("auth.confirmPassword")}
              value={doctorForm.confirmPassword}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
        </div>
      </div>

      <div
        className="space-y-3 rounded-[26px] border p-4"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface-1)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {t("auth.practiceDetails")}
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>Clinic Address (EN)</span>
            <Input
              name="address"
              placeholder={t("auth.clinicAddressPlaceholder")}
              value={doctorForm.address}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>عنوان العيادة (AR)</span>
            <Input
              name="address_ar"
              placeholder="عنوان العيادة بالعربي"
              value={doctorForm.address_ar}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
            />
          </label>
          <label
            className="grid gap-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>About Practice (EN)</span>
            <textarea
              name="about"
              value={doctorForm.about}
              onChange={handleDoctorChange}
              placeholder={t("auth.aboutPracticePlaceholder")}
              rows={3}
              className="theme-input rounded-2xl px-4 py-3"
              required
            />
          </label>
          <label
            className="grid gap-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>نبذة عن العيادة (AR)</span>
            <textarea
              name="about_ar"
              value={doctorForm.about_ar}
              onChange={handleDoctorChange}
              placeholder="اكتب نبذة بالعربي"
              rows={3}
              className="theme-input rounded-2xl px-4 py-3"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.yearsOfExperience")}</span>
            <Input
              name="year_of_experience"
              type="number"
              min="0"
              placeholder="12"
              value={doctorForm.year_of_experience}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
          <label
            className="block space-y-2 text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span>{t("auth.consultationFee")}</span>
            <Input
              name="appointment_fee"
              type="number"
              min="0"
              placeholder="150"
              value={doctorForm.appointment_fee}
              onChange={handleDoctorChange}
              className="h-12 rounded-2xl"
              required
            />
          </label>
        </div>
      </div>

      <label
        className="flex items-center gap-3 text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <input
          type="checkbox"
          required
          className="h-4 w-4 rounded border"
          style={{ accentColor: "var(--color-primary)" }}
        />
        <span>
          {t("auth.acceptTerms")}{" "}
          <Link
            href="/terms"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.termsOfService")}
          </Link>{" "}
          {locale === "ar" ? "و" : "and"}{" "}
          <Link
            href="/terms"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("terms.privacyTitle")}
          </Link>
          .
        </span>
      </label>

      <Button
        className="w-full rounded-full py-6 text-white"
        style={{ background: "var(--color-accent)" }}
        disabled={loading || categories.length === 0}
        type="submit"
      >
        {loading ? t("common.loading") : t("auth.createAccount")}
      </Button>
    </form>
  );

  return (
    <AuthSplitLayout
      imageSrc={currentImage}
      imageAlt={currentTitle}
      imageOverlay={currentImageOverlay}
      eyebrow={t("brand.name")}
      title={currentTitle}
      subtitle={currentSubtitle}
      showImageCard={false}
      showImageQuote={false}
      quote={
        selectedRole === "doctor"
          ? t("auth.doctorAccountDescription")
          : selectedRole === "patient"
            ? t("auth.patientAccountDescription")
            : t("auth.registerSubtitle")
      }
      quoteLabel={
        selectedRole
          ? t("auth.chooseAnotherRole")
          : t("auth.accountTypeSubtitle")
      }
    >
      <div className="flex items-center justify-between gap-4">
        {selectedRole ? (
          <button
            type="button"
            onClick={resetRole}
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.chooseAnotherRole")}
          </button>
        ) : (
          <span />
        )}
        <Link
          href="/auth/login"
          className="text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("auth.backToLogin")}
        </Link>
      </div>

      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {currentTitle}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {currentSubtitle}
        </p>
      </div>

      {!selectedRole
        ? renderRolePicker()
        : selectedRole === "doctor"
          ? renderDoctorForm()
          : renderPatientForm()}

      {selectedRole ? (
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.signIn")}
          </Link>
        </p>
      ) : null}
    </AuthSplitLayout>
  );
}

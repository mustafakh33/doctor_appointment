"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import AuthSplitLayout from "../_components/AuthSplitLayout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeReset } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const hasMinLength = formData.password.length >= 8;
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(formData.password);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasMinLength || !hasSpecialCharacter) {
      toast.error(t("common.error"));
      return;
    }

    setLoading(true);

    try {
      await completeReset({
        email,
        code,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      toast.success(t("auth.resetPassword"));
      router.push("/auth/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/assets/img/auth/Reset-Password.png"
      imageAlt={t("auth.resetPassword")}
      eyebrow={t("brand.name")}
      title={t("auth.resetPassword")}
      subtitle={t("auth.resetSubtitle")}
      quote={email || t("auth.email")}
      quoteLabel={t("auth.loginSecurity")}
    >
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("auth.resetPassword")}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {t("auth.resetSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.newPassword")}</span>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.newPassword")}
              value={formData.password}
              onChange={handleChange}
              className="h-12 rounded-2xl pl-10 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.confirmPassword")}</span>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.confirmPassword")}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-12 rounded-2xl pl-10 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        <Button
          className="w-full rounded-2xl py-6 text-white"
          style={{ background: "var(--color-accent)" }}
          disabled={loading}
          type="submit"
        >
          {loading ? t("common.loading") : t("auth.resetPassword")}
        </Button>

        <div
          className="grid grid-cols-1 gap-2 rounded-2xl border p-3 text-xs md:grid-cols-2"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          <div
            className="inline-flex items-center gap-2"
            style={{
              color: hasMinLength
                ? "var(--color-success)"
                : "var(--color-text-secondary)",
            }}
          >
            {hasMinLength ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            <span>{t("auth.passwordRuleMin")}</span>
          </div>
          <div
            className="inline-flex items-center gap-2"
            style={{
              color: hasSpecialCharacter
                ? "var(--color-success)"
                : "var(--color-text-secondary)",
            }}
          >
            {hasSpecialCharacter ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            <span>{t("auth.passwordRuleSpecial")}</span>
          </div>
        </div>
      </form>

      <div className="space-y-4 pt-1">
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
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("auth.backToLogin")}
        </Link>
      </div>
    </AuthSplitLayout>
  );
}

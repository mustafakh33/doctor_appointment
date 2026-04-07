"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import AuthSplitLayout from "../_components/AuthSplitLayout";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestReset } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await requestReset({ email });
      toast.success(t("auth.resetCodeSent"));
      router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/assets/img/auth/Forgot-Password.png"
      imageAlt={t("auth.forgotPassword")}
      eyebrow={t("brand.name")}
      title={t("auth.forgotPassword")}
      subtitle={t("auth.forgotSubtitle")}
      quote={t("auth.loginSecurity")}
      quoteLabel={t("clinic.ctaSubtitle")}
    >
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("auth.forgotPassword")}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.email")}</span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <Input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl pl-10"
              required
            />
          </div>
        </label>

        <Button
          className="w-full rounded-2xl py-6 text-white"
          style={{ background: "var(--color-accent)" }}
          disabled={loading}
          type="submit"
        >
          {loading ? t("common.loading") : t("auth.sendResetLink")}
        </Button>
      </form>

      <div className="space-y-4 pt-1">
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("auth.haveAccount")}{" "}
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

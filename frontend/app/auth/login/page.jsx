"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import AuthSplitLayout from "../_components/AuthSplitLayout";
import { getDefaultPathByRole } from "@/app/_utils/roleAccess";

const initialState = { identifier: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const session = await login(formData);
      toast.success(t("auth.login"));
      router.push(getDefaultPathByRole(session?.user?.role));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          t("common.error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/assets/img/auth/Login-Page.png"
      imageAlt={t("auth.login")}
      eyebrow={t("brand.name")}
      title={t("auth.login")}
      subtitle={t("auth.loginSubtitle")}
      quote={t("auth.loginSecurity")}
      quoteLabel={t("clinic.ctaSubtitle")}
      showImageBrand
      showImageCard={false}
      showImageQuote={false}
    >
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("auth.login")}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.emailOrPhone")}</span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <Input
              name="identifier"
              type="text"
              placeholder={t("auth.emailOrPhone")}
              value={formData.identifier}
              onChange={handleChange}
              className="h-12 rounded-2xl pl-10"
              required
            />
          </div>
        </label>

        <label
          className="block space-y-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span>{t("auth.password")}</span>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
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

        <div className="flex items-center text-sm">
          <Link
            href="/auth/forgot-password"
            className="font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button
          className="w-full rounded-full py-6 text-white"
          style={{ background: "var(--color-accent)" }}
          disabled={loading}
          type="submit"
        >
          {loading ? t("common.loading") : t("auth.signIn")}
        </Button>
      </form>

      <div className="pt-1">
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("auth.noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("auth.register")}
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}

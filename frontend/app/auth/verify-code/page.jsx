"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import AuthSplitLayout from "../_components/AuthSplitLayout";
import { requestPasswordReset } from "@/app/_utils/Api";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 180;

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmResetCode } = useAuth();
  const { t } = useLanguage();
  const [codeDigits, setCodeDigits] = useState(
    Array.from({ length: CODE_LENGTH }, () => ""),
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const code = codeDigits.join("");

  const formatCountdown = (value) => {
    const safeValue = Math.max(0, Number(value || 0));
    const minutes = String(Math.floor(safeValue / 60)).padStart(2, "0");
    const seconds = String(safeValue % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleDigitChange = (index, rawValue) => {
    const value = String(rawValue || "")
      .replace(/\D/g, "")
      .slice(-1);

    setCodeDigits((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    if (value && index < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`verify-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      const previousInput = document.getElementById(`verify-code-${index - 1}`);
      previousInput?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    event.preventDefault();
    const next = Array.from(
      { length: CODE_LENGTH },
      (_, index) => pasted[index] || "",
    );
    setCodeDigits(next);

    const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    if (lastIndex >= 0) {
      const targetInput = document.getElementById(`verify-code-${lastIndex}`);
      targetInput?.focus();
    }
  };

  const handleResend = async () => {
    if (!email || secondsLeft > 0 || resending) return;
    setResending(true);

    try {
      await requestPasswordReset({ email });
      toast.success(t("auth.resetCodeSent"));
      setSecondsLeft(RESEND_SECONDS);
      setCodeDigits(Array.from({ length: CODE_LENGTH }, () => ""));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length !== CODE_LENGTH) {
      toast.error(t("auth.enterCode"));
      return;
    }

    setLoading(true);

    try {
      await confirmResetCode({ email, code });
      toast.success(t("auth.verifyCode"));
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/assets/img/auth/Verify-Code.png"
      imageAlt={t("auth.verifyCode")}
      eyebrow={t("brand.name")}
      title={t("auth.verifyCode")}
      subtitle={t("auth.verifySubtitle")}
      quote={email || t("auth.email")}
      quoteLabel={t("auth.loginSecurity")}
    >
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("auth.verifyCode")}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {t("auth.verifySubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("auth.enterCode")}
          </p>
          <div
            className="flex items-center gap-2 md:gap-3"
            onPaste={handlePaste}
          >
            {codeDigits.map((digit, index) => (
              <input
                key={index}
                id={`verify-code-${index}`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) =>
                  handleDigitChange(index, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="h-14 w-12 rounded-xl border text-center text-lg font-semibold outline-none transition md:w-14"
                style={{
                  borderColor: digit
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  background: "var(--color-surface-2)",
                  color: "var(--color-text-primary)",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-3 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {formatCountdown(secondsLeft)}
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0 || resending}
            className="font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            style={{ color: "var(--color-primary)" }}
          >
            {resending ? t("common.loading") : t("auth.resendCode")}
          </button>
        </div>

        <Button
          className="w-full rounded-2xl py-6 text-white"
          style={{ background: "var(--color-accent)" }}
          disabled={loading}
          type="submit"
        >
          {loading ? t("common.loading") : t("auth.verifyContinue")}
        </Button>
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
          href="/auth/forgot-password"
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

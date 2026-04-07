"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="max-w-lg rounded-3xl border bg-white p-10 text-center" style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                    404
                </p>
                <h1 className="mt-4 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>{t("notFound.title")}</h1>
                <p className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {t("notFound.subtitle")}
                </p>
                <Link href="/" className="mt-6 inline-flex">
                    <Button className="text-white" style={{ background: "var(--color-accent)" }}>{t("notFound.goHome")}</Button>
                </Link>
            </div>
        </div>
    );
}

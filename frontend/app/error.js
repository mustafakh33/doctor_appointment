"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function Error({ error, reset }) {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
                    {t("error.badge")}
                </p>
                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    {t("error.title")}
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                    {error?.message || t("error.subtitle")}
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Button onClick={reset}>{t("common.retry")}</Button>
                    <Link href="/">
                        <Button variant="outline">{t("notFound.goHome")}</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

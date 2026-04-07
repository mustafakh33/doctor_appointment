"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getCategories, getDoctorsByCategory } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { localizeCategory } from "@/app/_utils/localize";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/app/_components/DoctorCard";
import Spinner from "@/app/_components/Spinner";

const ITEMS_PER_PAGE = 8;

const normalizeCategoryTerm = (value) => {
    if (value === null || value === undefined) return "";

    let normalized = String(value);
    try {
        normalized = decodeURIComponent(normalized);
    } catch {
        // Keep original text if decoding fails.
    }

    return normalized.replace(/\s+/g, " ").trim().toLowerCase();
};

function SearchByCategoryPage() {
    const { categoryName } = useParams();
    const { t, locale } = useLanguage();
    const [doctorList, setDoctorList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const decodedCategoryName = useMemo(() => {
        if (!categoryName) return "";

        try {
            return decodeURIComponent(String(categoryName));
        } catch {
            return String(categoryName);
        }
    }, [categoryName]);

    useEffect(() => {
        const loadDoctors = async () => {
            setLoading(true);

            try {
                const categoryList = await getCategories();
                const safeCategories = Array.isArray(categoryList) ? categoryList : [];

                const normalizedRequested = normalizeCategoryTerm(decodedCategoryName);
                const matchedCategory = safeCategories.find((category) => {
                    const candidates = [category?.name, category?.name_en, category?.name_ar];
                    return candidates.some(
                        (candidate) => normalizeCategoryTerm(candidate) === normalizedRequested,
                    );
                });

                const doctors = await getDoctorsByCategory(
                    matchedCategory?.documentId || matchedCategory?.id || decodedCategoryName,
                );

                setDoctorList(Array.isArray(doctors) ? doctors : []);
                setCategories(safeCategories);
            } finally {
                setCurrentPage(1);
                setLoading(false);
            }
        };

        if (categoryName) {
            loadDoctors();
        }
    }, [categoryName, decodedCategoryName]);

    const selectedCategory = useMemo(
        () =>
            categories.find(
                (category) => {
                    const requested = normalizeCategoryTerm(decodedCategoryName);
                    if (!requested) return false;

                    const candidates = [category?.name, category?.name_en, category?.name_ar];
                    return candidates.some(
                        (candidate) => normalizeCategoryTerm(candidate) === requested,
                    );
                },
            ),
        [categories, decodedCategoryName],
    );

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(doctorList.length / ITEMS_PER_PAGE)),
        [doctorList.length],
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedDoctors = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return doctorList.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, doctorList]);

    return (
        <div>
            <section
                className="rounded-3xl p-6 md:p-8"
                style={{
                    background:
                        "linear-gradient(125deg, var(--color-primary-50), var(--color-secondary-light))",
                    border: "1px solid var(--color-border)",
                }}
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{
                                background: "var(--color-bg-primary)",
                                color: "var(--color-primary)",
                            }}
                        >
                            {t("nav.categories", "Category")}
                        </span>
                        <h2
                            className="mt-3 text-2xl font-extrabold md:text-4xl"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            {localizeCategory(selectedCategory, locale) || decodedCategoryName}
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            {t("sections.showingOf", undefined, {
                                shown: paginatedDoctors.length,
                                total: doctorList.length,
                            })}
                        </p>
                    </div>

                    <Link
                        href="/doctors"
                        className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold"
                        style={{
                            background: "var(--color-bg-primary)",
                            color: "var(--color-primary)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        {t("nav.doctors")}
                    </Link>
                </div>
            </section>

            <section className="mt-6">
                {loading ? (
                    <div className="flex min-h-80 flex-col items-center justify-center gap-3">
                        <Spinner />
                        <p style={{ color: "var(--color-text-secondary)" }}>
                            loading
                        </p>
                    </div>
                ) : doctorList.length === 0 ? (
                    <div className="card-surface py-12 text-center">
                        <SearchX
                            className="mx-auto h-12 w-12"
                            style={{ color: "var(--color-text-muted)" }}
                        />
                        <p className="mt-4 text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            {t("emptyState.noDoctorsTitle")}
                        </p>
                        <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
                            {t("emptyState.noDoctorsText")}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {paginatedDoctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-10 rounded-full p-0"
                                onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="px-3 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                {currentPage} / {totalPages}
                            </span>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-10 rounded-full p-0"
                                onClick={() =>
                                    setCurrentPage((previous) => Math.min(totalPages, previous + 1))
                                }
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default SearchByCategoryPage;

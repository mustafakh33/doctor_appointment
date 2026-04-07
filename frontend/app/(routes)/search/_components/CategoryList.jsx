"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { localizeCategory } from "@/app/_utils/localize";

const normalizeCategoryTerm = (value) => {
  if (value === null || value === undefined) return "";

  let normalized = String(value);
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // Keep original value if decoding fails.
  }

  return normalized.replace(/\s+/g, " ").trim().toLowerCase();
};

function CategoryList() {
  const { t, locale } = useLanguage();
  const { categoryName } = useParams();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        setCategoryList(categories || []);
        setError(null);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError(err.message || "Failed to load categories");
        setCategoryList([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div
      className="overflow-hidden rounded-3xl border"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface-1)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="border-b px-4 py-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("sections.selectSpecialty")}
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t(
            "sections.departmentSearchHint",
            "Choose a department to update search results.",
          )}
        </p>
      </div>

      {loading ? (
        <div
          className="py-8 text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("sections.loadingCategories", "Loading categories...")}
        </div>
      ) : error ? (
        <div
          className="px-4 py-4 text-sm"
          style={{
            color: "var(--color-danger)",
            background: "var(--color-danger-light)",
          }}
        >
          {error}
        </div>
      ) : categoryList.length === 0 ? (
        <div
          className="py-8 text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("sections.noCategoriesAvailable", "No categories available")}
        </div>
      ) : (
        <Command
          className="rounded-none border-0 bg-transparent"
          style={{ color: "var(--color-text-primary)" }}
        >
          <CommandInput
            placeholder={t("sections.searchCategories")}
            className="border-0 border-b bg-transparent focus:ring-0"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />
          <CommandList className="max-h-[420px] bg-transparent">
            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
            <CommandGroup>
              {categoryList?.map((cat) => {
                const currentCategoryTerm = normalizeCategoryTerm(categoryName);
                const categoryCandidates = [
                  cat?.name,
                  cat?.name_en,
                  cat?.name_ar,
                ];
                const isActive = categoryCandidates.some(
                  (candidate) =>
                    normalizeCategoryTerm(candidate) === currentCategoryTerm,
                );
                const imageUrl = cat?.icon?.url || cat?.image?.url;
                const categorySlugSource =
                  cat?.name_en || cat?.name || cat?.name_ar || "";
                const categorySlug = encodeURIComponent(
                  String(categorySlugSource),
                );

                return (
                  <CommandItem
                    key={cat.id || cat.documentId}
                    className="bg-transparent p-0 data-[selected=true]:bg-transparent"
                  >
                    <Link
                      href={`/search/${categorySlug}`}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition"
                      style={
                        isActive
                          ? {
                              background: "var(--color-primary-50)",
                              borderInlineStart:
                                "3px solid var(--color-primary)",
                            }
                          : undefined
                      }
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, var(--color-primary-50), var(--color-secondary-light))"
                            : "var(--color-primary-50)",
                        }}
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            width={22}
                            height={22}
                            alt={localizeCategory(cat, locale)}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span
                            className="text-xs font-bold"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {localizeCategory(cat, locale)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <label
                        className="cursor-pointer flex-1 text-sm font-medium"
                        style={{
                          color: isActive
                            ? "var(--color-primary)"
                            : "var(--color-text-primary)",
                        }}
                      >
                        {localizeCategory(cat, locale)}
                      </label>

                      {isActive ? (
                        <span
                          className="ms-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] shrink-0"
                          style={{
                            background: "var(--color-primary-light)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {t("sections.active", "Active")}
                        </span>
                      ) : null}
                    </Link>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
}

export default CategoryList;

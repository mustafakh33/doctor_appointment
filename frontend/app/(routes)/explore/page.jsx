"use client";

import { Suspense } from "react";
import ExploreClient from "./ExploreClient";
import { useLanguage } from "@/app/_context/LanguageContext";

function ExploreLoading() {
  const { t } = useLanguage();

  return (
    <div
      className="px-5 py-8 md:px-20"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {t("common.loading")}
    </div>
  );
}

function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreClient />
    </Suspense>
  );
}

export default ExplorePage;

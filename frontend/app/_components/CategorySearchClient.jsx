"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/app/_context/LanguageContext";

function CategorySearchClient() {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();

    if (!query) {
      router.push("/explore");
      return;
    }

    router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center gap-2"
    >
      <Input
        type="text"
        placeholder={t("hero.searchPlaceholder")}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <Button
        type="submit"
        className="text-white"
        style={{ background: "var(--color-accent)" }}
      >
        {t("common.search")}
      </Button>
    </form>
  );
}

export default CategorySearchClient;

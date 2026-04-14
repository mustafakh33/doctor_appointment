import Link from "next/link";
import Image from "next/image";
import { localizeCategory } from "@/app/_utils/localize";

function CategoryCard({ category, index, icon: Icon, locale, t }) {
  const hasImage = category?.icon?.url || category?.image?.url;
  const imageUrl = category?.icon?.url || category?.image?.url;
  const doctorsCount = Number(
    category?.doctorsCount || category?.doctors?.length || 0,
  );

  return (
    <Link href={`/search/${category.name}`} className="group block">
      <article
        className="relative overflow-hidden rounded-3xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-500 dark:hover:bg-slate-700/80"
        style={{
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex h-40 w-full items-center justify-center border-b border-gray-200 bg-linear-to-br from-brand-light to-mint-light dark:border-slate-700 dark:from-slate-800 dark:to-slate-700">
          {hasImage ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={imageUrl}
                alt={localizeCategory(category, locale)}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <Icon className="h-16 w-16 text-brand dark:text-brand-light" />
          )}
        </div>

        <div className="bg-card p-5 dark:bg-slate-800/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {localizeCategory(category, locale)}
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {t("categories.doctorsCount", undefined, {
                  count: doctorsCount,
                })}
              </p>
            </div>

            <div className="shrink-0 rounded-full bg-mint-light px-3 py-1 text-xs font-semibold text-mint-dark dark:bg-slate-700 dark:text-slate-200">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              Explore
            </span>
            <span className="text-sm font-semibold text-brand transition-colors group-hover:opacity-80 dark:text-brand-dark">
              View Doctors →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default CategoryCard;

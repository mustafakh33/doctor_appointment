import SkeletonBlock from "./SkeletonBlock";

function DoctorCardSkeleton() {
  return (
    <article
      className="relative h-full overflow-hidden rounded-xl border"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ background: "var(--color-surface-1)" }}
      >
        <SkeletonBlock className="aspect-21/13 w-full rounded-none" />
        <SkeletonBlock className="absolute inset-e-3 top-3 h-6 w-12 rounded-full" />
      </div>

      <div className="space-y-2 p-5 text-start">
        <SkeletonBlock className="h-6 w-28 rounded-full" />
        <SkeletonBlock className="h-6 w-3/4 rounded-md" />
        <SkeletonBlock className="mt-2 h-4 w-2/3 rounded-md" />
        <SkeletonBlock className="h-4 w-1/2 rounded-md" />
        <SkeletonBlock className="h-4 w-1/3 rounded-md" />
        <div className="pt-2">
          <SkeletonBlock className="h-11 w-full rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default DoctorCardSkeleton;

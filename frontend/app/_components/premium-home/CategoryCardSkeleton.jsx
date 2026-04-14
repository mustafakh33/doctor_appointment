import SkeletonBlock from "./SkeletonBlock";

function CategoryCardSkeleton() {
  return (
    <div className="block h-full">
      <div
        className="relative h-full overflow-hidden rounded-2xl"
        style={{
          background: "var(--color-surface-1)",
          boxShadow: "var(--shadow-card)",
          minHeight: "224px",
        }}
      >
        <div
          className="flex h-32 w-full items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light))",
          }}
        >
          <SkeletonBlock className="h-20 w-20 rounded-full" />
        </div>

        <div className="space-y-2 p-4">
          <SkeletonBlock className="h-5 w-3/4 rounded-md" />
          <SkeletonBlock className="h-4 w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default CategoryCardSkeleton;

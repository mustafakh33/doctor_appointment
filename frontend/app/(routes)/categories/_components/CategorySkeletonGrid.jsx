import CategoryCardSkeleton from "@/app/_components/premium-home/CategoryCardSkeleton";

function CategorySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default CategorySkeletonGrid;

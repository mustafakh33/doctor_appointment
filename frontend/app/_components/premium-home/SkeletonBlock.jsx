function SkeletonBlock({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer ${className}`.trim()}
    />
  );
}

export default SkeletonBlock;

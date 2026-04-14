import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10 transition-all duration-300">
      <Spinner />
    </div>
  );
}


import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="py-20 md:py-36">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-14 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksSkeleton() {
	return (
		<div className="space-y-4">
			{/* Top Bar: Lists & Search Controls Skeleton */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{/* List Filter Tabs Skeleton */}
				<div className="flex items-center gap-2 overflow-x-auto pb-1">
					<Skeleton className="h-8 w-28 rounded-lg shrink-0" />
					<Skeleton className="h-8 w-28 rounded-lg shrink-0" />
					<Skeleton className="h-8 w-24 rounded-lg shrink-0" />
					<Skeleton className="h-8 w-20 rounded-lg shrink-0" />
				</div>

				{/* Search & Sort Controls Skeleton */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-44 sm:w-60 rounded-lg" />
					<Skeleton className="h-8 w-28 rounded-lg" />
				</div>
			</div>

			{/* Bookmarked Products Grid Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card
						key={i}
						className="rounded-lg border-border/60 bg-card/60 p-0 overflow-hidden flex flex-col justify-between"
					>
						<CardHeader className="p-4 pb-2 space-y-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-2.5">
									<Skeleton className="size-9 rounded-lg shrink-0" />
									<div className="space-y-1.5">
										<Skeleton className="h-4 w-28 rounded-md" />
										<Skeleton className="h-3 w-20 rounded-md" />
									</div>
								</div>
								<Skeleton className="h-5 w-16 rounded-md" />
							</div>

							<div className="space-y-1.5 pt-1">
								<Skeleton className="h-3.5 w-full rounded-md" />
								<Skeleton className="h-3.5 w-3/4 rounded-md" />
							</div>
						</CardHeader>

						<CardContent className="px-4 pb-3 pt-0 space-y-3">
							<div className="flex gap-1.5">
								<Skeleton className="h-4 w-12 rounded-md" />
								<Skeleton className="h-4 w-14 rounded-md" />
							</div>

							{/* Notes Memo Skeleton */}
							<Skeleton className="h-12 w-full rounded-lg" />
						</CardContent>

						<div className="p-3 px-4 border-t border-border/40 bg-muted/10 flex items-center justify-between">
							<Skeleton className="h-4 w-12 rounded-md" />
							<div className="flex items-center gap-1.5">
								<Skeleton className="size-7 rounded-md" />
								<Skeleton className="size-7 rounded-md" />
								<Skeleton className="size-7 rounded-md" />
								<Skeleton className="h-7 w-12 rounded-md" />
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

export { BookmarksSkeleton };

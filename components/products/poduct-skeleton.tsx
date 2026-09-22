import { Skeleton } from "../ui/skeleton";

export function ProductDetailSkeleton() {
	return (
		<div className="pb-12 pt-6 min-h-screen">
			<div className="wrapper space-y-8">
				<Skeleton className="h-9 w-32 rounded-md" />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					<div className="lg:col-span-2 space-y-6">
						<div className="space-y-3">
							<div className="flex gap-2">
								<Skeleton className="h-5 w-24 rounded-full" />
								<Skeleton className="h-5 w-28 rounded-full" />
							</div>
							<Skeleton className="h-10 w-3/4 rounded-md" />
							<Skeleton className="h-5 w-1/2 rounded-md" />
							<div className="flex gap-2 pt-2">
								<Skeleton className="h-6 w-16 rounded-full" />
								<Skeleton className="h-6 w-16 rounded-full" />
							</div>
						</div>

						<div className="space-y-3 pt-4">
							<Skeleton className="h-6 w-40 rounded-md" />
							<Skeleton className="h-4 w-full rounded-md" />
							<Skeleton className="h-4 w-5/6 rounded-md" />
							<Skeleton className="h-4 w-4/6 rounded-md" />
						</div>

						<Skeleton className="h-32 w-full rounded-lg" />
					</div>

					<div className="lg:col-span-1">
						<Skeleton className="h-72 w-full rounded-lg" />
					</div>
				</div>

				<Skeleton className="h-96 w-full rounded-lg" />
			</div>
		</div>
	);
}

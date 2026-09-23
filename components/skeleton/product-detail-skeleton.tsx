import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
	return (
		<div className="pb-12 pt-6 min-h-screen">
			<div className="wrapper space-y-8">
				{/* Back button */}
				<Skeleton className="h-8 w-24 rounded-lg" />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					{/* Left Column: Product Info & Details */}
					<div className="lg:col-span-2 space-y-6">
						<div className="space-y-3">
							<div className="flex gap-2">
								<Skeleton className="h-5 w-24 rounded-full" />
								<Skeleton className="h-5 w-32 rounded-full" />
							</div>

							<Skeleton className="h-9 w-3/4 rounded-lg" />
							<Skeleton className="h-5 w-1/2 rounded-md" />

							<div className="flex gap-2 pt-2">
								<Skeleton className="h-5 w-16 rounded-md" />
								<Skeleton className="h-5 w-20 rounded-md" />
								<Skeleton className="h-5 w-14 rounded-md" />
							</div>
						</div>

						{/* About Description Box */}
						<div className="space-y-3 pt-2">
							<Skeleton className="h-6 w-36 rounded-md" />
							<Skeleton className="h-4 w-full rounded-md" />
							<Skeleton className="h-4 w-11/12 rounded-md" />
							<Skeleton className="h-4 w-4/5 rounded-md" />
						</div>

						{/* Launch Details Card */}
						<Card className="rounded-lg border-border/60 bg-muted/10 p-5 space-y-3">
							<Skeleton className="h-5 w-32 rounded-md" />
							<div className="space-y-2 pt-1">
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-24 rounded-md" />
									<Skeleton className="h-4 w-28 rounded-md" />
								</div>
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-28 rounded-md" />
									<Skeleton className="h-4 w-32 rounded-md" />
								</div>
							</div>
						</Card>
					</div>

					{/* Right Column: Sticky Action Box */}
					<div className="lg:col-span-1">
						<Card className="rounded-lg border-border/60 bg-card p-5 space-y-5">
							<div className="space-y-2 text-center flex flex-col items-center">
								<Skeleton className="h-6 w-32 rounded-md" />
								<Skeleton className="h-20 w-20 rounded-lg" />
							</div>

							<div className="border-t border-border/40 pt-4 space-y-3">
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-32 rounded-md" />
									<Skeleton className="h-4 w-8 rounded-md" />
								</div>
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-28 rounded-md" />
									<Skeleton className="h-4 w-12 rounded-md" />
								</div>
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-28 rounded-md" />
									<Skeleton className="h-4 w-8 rounded-md" />
								</div>
							</div>

							<div className="pt-2 space-y-2">
								<Skeleton className="h-10 w-full rounded-full" />
								<Skeleton className="h-10 w-full rounded-full" />
							</div>
						</Card>
					</div>
				</div>

				{/* Bottom Community Hub Tabs Skeleton */}
				<Card className="rounded-lg border-border/60 bg-card/60 p-6 space-y-6">
					<div className="flex gap-4 border-b border-border/40 pb-3">
						<Skeleton className="h-7 w-28 rounded-md" />
						<Skeleton className="h-7 w-28 rounded-md" />
						<Skeleton className="h-7 w-28 rounded-md" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-20 w-full rounded-lg" />
						<Skeleton className="h-20 w-full rounded-lg" />
					</div>
				</Card>
			</div>
		</div>
	);
}

export { ProductDetailSkeleton };

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsSkeletonProps {
	count?: number;
	className?: string;
}

export default function ProductsSkeleton({
	count = 6,
	className = "grid-wrapper",
}: ProductsSkeletonProps) {
	return (
		<div className={className}>
			{Array.from({ length: count }).map((_, i) => (
				<Card
					key={i}
					className="min-h-45 border-border/60 bg-card/40 rounded-lg overflow-hidden flex flex-col justify-between"
				>
					<CardHeader className="p-4 pb-2">
						<div className="flex items-start gap-4">
							<div className="flex-1 space-y-2.5 min-w-0">
								<Skeleton className="h-5 w-40 rounded-md" />
								<Skeleton className="h-4 w-full rounded-md" />
								<Skeleton className="h-4 w-3/4 rounded-md" />
							</div>

							<div className="flex flex-col gap-1.5 shrink-0 items-center justify-center p-1 rounded-md bg-muted/20">
								<Skeleton className="size-6 rounded-md" />
								<Skeleton className="h-4 w-6 rounded-md" />
								<Skeleton className="size-6 rounded-md" />
							</div>
						</div>
					</CardHeader>

					<CardFooter className="p-4 pt-2 flex items-center justify-between gap-2 border-t border-border/20">
						<div className="flex items-center gap-1.5 flex-wrap">
							<Skeleton className="h-5 w-14 rounded-md" />
							<Skeleton className="h-5 w-16 rounded-md" />
							<Skeleton className="h-5 w-12 rounded-md" />
						</div>

						<Skeleton className="size-7 rounded-md shrink-0" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

export { ProductsSkeleton };

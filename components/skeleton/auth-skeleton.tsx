import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
	return (
		<div className="flex items-center gap-2">
			<Skeleton className="h-9 w-18 rounded-md" />
			<Skeleton className="h-9 w-20 rounded-md" />
		</div>
	);
}

export function MobileAuthSkeleton() {
	return (
		<div className="flex flex-col gap-2.5 w-full">
			<Skeleton className="h-9 w-full rounded-md" />
			<Skeleton className="h-9 w-full rounded-md" />
		</div>
	);
}

import { cn } from "@/lib/utils";
import { LucideIcon, Sunrise } from "lucide-react";

export default function EmptyState({
	header,
	message,
	icon: Icon,
	className,
	button
}: {
	header: string;
	message: string;
	icon?: LucideIcon;
	className?: string;
	button?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"h-65 px-4 flex flex-col justify-center items-center text-center border rounded-lg bg-background/50 border-dashed space-y-2",
				className,
			)}
		>
			{Icon ? (
				<Icon className="size-8 md:size-10 text-muted-foreground/90" />
			) : <Sunrise className="size-8 md:size-10 text-muted-foreground/90" />}

			<div className="space-y-1 max-w-md mx-auto">
				<h4 className="font-semibold text-base">{header}</h4>
				<p className="text-sm text-muted-foreground">
					{message}
				</p>
			</div>

			{button}
		</div>
	);
}

import { LucideIcon } from "lucide-react";

export default function SectionHeader({
	title,
	icon: Icon,
	description,
}: {
	title: string;
	icon?: LucideIcon;
	description: string;
}) {
	return (
		<div>
			<div className="flex items-center gap-2 mb-1">
				{Icon && <Icon className="size-6 text-primary" />}
				<h2 className="text-2xl font-bold">{title}</h2>
			</div>
			<p className="text-muted-foreground text-base">{description}</p>
		</div>
	);
}

"use client";

import { StepBack } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
	const router = useRouter();
	return (
		<button
			className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
			onClick={() => router.back()}
		>
			<StepBack className="size-4 group-hover:text-primary transition-colors duration-200" />{" "}
		</button>
	);
}

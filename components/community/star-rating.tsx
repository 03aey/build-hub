"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
	value: number;
	onChange?: (val: number) => void;
	readOnly?: boolean;
	size?: "sm" | "md" | "lg";
	showValue?: boolean;
}

export default function StarRating({
	value,
	onChange,
	readOnly = true,
	size = "md",
	showValue = false,
}: StarRatingProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);

	const sizeClasses = {
		sm: "size-3.5",
		md: "size-5",
		lg: "size-6",
	};

	const displayValue = hoverValue !== null ? hoverValue : value;

	return (
		<div className="flex items-center gap-1.5">
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((star) => {
					const isFilled = star <= displayValue;

					return (
						<button
							key={star}
							type="button"
							disabled={readOnly}
							onClick={() => onChange?.(star)}
							onMouseEnter={() => !readOnly && setHoverValue(star)}
							onMouseLeave={() => !readOnly && setHoverValue(null)}
							className={cn(
								"transition-transform",
								!readOnly && "cursor-pointer hover:scale-115 focus:outline-hidden",
								readOnly && "cursor-default",
							)}
						>
							<Star
								className={cn(
									sizeClasses[size],
									isFilled
										? "fill-amber-400 text-amber-400"
										: "text-muted-foreground/30 fill-muted-foreground/10",
									"transition-colors",
								)}
							/>
						</button>
					);
				})}
			</div>
			{showValue && (
				<span className="text-sm font-semibold ml-1">
					{value.toFixed(1)}
				</span>
			)}
		</div>
	);
}

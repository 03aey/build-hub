"use client";

import {
	downvoteProductAction,
	getVoteStatusAction,
	upvoteProductAction,
} from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function VotingButtons({
	voteCount,
	productId,
}: {
	voteCount: number;
	productId: number;
}) {
	const [hasVoted, setHasVoted] = useState(false);
	const [optimisticVotes, setOptimisticVotes] = useOptimistic(
		voteCount,
		(state, change: number) => Math.max(0, state + change),
	);

	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		getVoteStatusAction(productId).then(setHasVoted);
	}, [productId]);

	const handleUpvote = () => {
		if (hasVoted) return;

		startTransition(async () => {
			setOptimisticVotes(1);
			setHasVoted(true);
			await upvoteProductAction(productId);
		});
	};

	const handleDownvote = () => {
		if (!hasVoted) return;

		startTransition(async () => {
			setOptimisticVotes(-1);
			setHasVoted(false);
			await downvoteProductAction(productId);
		});
	};

	return (
		<div
			className="flex flex-col items-center gap-1 shrink-0"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<Button
				onClick={handleUpvote}
				variant="ghost"
				size="icon-sm"
				className={cn(
					"h-8 w-8 text-primary disabled:cursor-default",
					hasVoted
						? "bg-primary/20 text-primary cursor-default hover:bg-primary/20 hover:text-primary"
						: "hover:bg-primary/10 hover:text-primary cursor-pointer",
				)}
				disabled={isPending}
			>
				<ChevronUpIcon className="size-5" />
			</Button>
			<span className="text-sm font-semibold transition-colors text-foreground">
				{optimisticVotes}
			</span>
			<Button
				onClick={handleDownvote}
				variant="ghost"
				size="icon-sm"
				disabled={isPending}
				className={cn(
					"h-8 w-8 text-primary",
					!hasVoted
						? "cursor-default hover:bg-transparent hover:text-primary"
						: "hover:text-primary hover:bg-primary/10",
				)}
			>
				<ChevronDownIcon className="size-5" />
			</Button>
		</div>
	);
}

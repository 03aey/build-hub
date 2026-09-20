"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	NestedCommentType,
	ProductReviewType,
	ProductUpdateType,
	ReviewStatsType,
} from "@/types";
import {
	History,
	Logs,
	MessageSquare,
	Rocket,
	Sparkles,
	Star,
} from "lucide-react";
import React, { useState } from "react";
import ChangelogSection from "./changelog-section";
import DiscussionSection from "./discussion-section";
import ReviewsSection from "./reviews-section";

interface CommunityTabsProps {
	productId: number;
	productName: string;
	productSlug: string;
	isMaker: boolean;
	comments: NestedCommentType[];
	updates: ProductUpdateType[];
	reviews: ProductReviewType[];
	reviewStats: ReviewStatsType;
}

export default function CommunityTabs({
	productId,
	productName,
	productSlug,
	isMaker,
	comments,
	updates,
	reviews,
	reviewStats,
}: CommunityTabsProps) {
	const [activeTab, setActiveTab] = useState<"discussion" | "changelog" | "reviews">("discussion");

	return (
		<div className="space-y-4">
			{/* Tab Switcher Navigation */}
			<div className="flex items-center gap-2 border-b overflow-x-auto no-scrollbar pb-0">
				{/* 1. Discussions */}
				<button
					type="button"
					onClick={() => setActiveTab("discussion")}
					className={cn(
						"flex items-center gap-2 px-4 pl-0 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer",
						activeTab === "discussion"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
					)}
				>
					<MessageSquare className="size-4" />
					<span>Discussion | Q&A</span>
					<Badge
						variant="secondary"
						className={cn(
							"text-xs px-1.5 py-0 h-5",
							activeTab === "discussion"
								? "bg-primary/20 text-primary"
								: "bg-muted text-muted-foreground",
						)}
					>
						{comments.length}
					</Badge>
				</button>

				{/* 2. Maker Changelog */}
				<button
					type="button"
					onClick={() => setActiveTab("changelog")}
					className={cn(
						"flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer",
						activeTab === "changelog"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
					)}
				>
					<Logs className="size-4" />
					<span>Maker Changelog</span>

					<Badge
						variant="secondary"
						className={cn(
							"text-xs px-1.5 py-0 h-5",
							activeTab === "changelog"
								? "bg-primary/20 text-primary"
								: "bg-muted text-muted-foreground",
						)}
					>
						{updates.length}
					</Badge>
				</button>

				{/* 3. Structured Reviews */}
				<button
					type="button"
					onClick={() => setActiveTab("reviews")}
					className={cn(
						"flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer",
						activeTab === "reviews"
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
					)}
				>
					<Star className="size-4" />
					<span>Reviews & Ratings</span>
					{reviewStats.totalReviews > 0 ? (
						<Badge
							variant="secondary"
							className={cn(
								"text-xs px-1.5 py-0 h-5 flex items-center gap-1",
								activeTab === "reviews"
									? "bg-primary/20 text-primary"
									: "bg-muted text-muted-foreground",
							)}
						>
							★ {reviewStats.averageRating.toFixed(1)} ( {reviewStats.totalReviews} )
						</Badge>
					) : (
						<Badge
							variant="secondary"
							className={cn("text-xs px-1.5 py-0 h-5", activeTab === "reviews" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}
						>
							0
						</Badge>
					)}
				</button>
			</div>

			{/* Tab Body */}
			<>
				{activeTab === "discussion" && (
					<DiscussionSection
						productId={productId}
						comments={comments}
						isMaker={isMaker}
						productSlug={productSlug}
					/>
				)}

				{activeTab === "changelog" && (
					<ChangelogSection
						productId={productId}
						updates={updates}
						isMaker={isMaker}
						productName={productName}
					/>
				)}

				{activeTab === "reviews" && (
					<ReviewsSection
						productId={productId}
						reviews={reviews}
						stats={reviewStats}
						productName={productName}
					/>
				)}
			</>
		</div>
	);
}

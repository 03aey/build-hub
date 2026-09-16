import { InferSelectModel } from "drizzle-orm";
import { comments, products, productUpdates, productReviews } from "@/db/schema";

export type FormState = {
	success: boolean;
	errors?: Record<string, string[]>;
	message: string;
};

export type ProductType = InferSelectModel<typeof products>;
export type CommentType = InferSelectModel<typeof comments>;
export type ProductUpdateType = InferSelectModel<typeof productUpdates>;
export type ProductReviewType = InferSelectModel<typeof productReviews>;

export type NestedCommentType = CommentType & {
	replies?: NestedCommentType[];
};

export type ReviewStatsType = {
	averageRating: number;
	totalReviews: number;
	averageUxRating: number;
	averagePricingRating: number;
	ratingDistribution: Record<number, number>;
};


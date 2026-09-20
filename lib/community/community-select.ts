import { db } from "@/db";
import { comments, productReviews, productUpdates, products } from "@/db/schema";
import {
	CommentType,
	NestedCommentType,
	ProductReviewType,
	ProductUpdateType,
	ReviewStatsType,
} from "@/types";
import { asc, desc, eq } from "drizzle-orm";

/**
 * Fetch all comments for a product and assemble them into a nested parent/reply tree.
 */
export async function getNestedComments(
	productId: number,
): Promise<NestedCommentType[]> {
	try {
		const rawComments: CommentType[] = await db
			.select()
			.from(comments)
			.where(eq(comments.productId, productId))
			.orderBy(asc(comments.createdAt));

		const commentMap = new Map<number, NestedCommentType>();
		const rootComments: NestedCommentType[] = [];

		for (const comment of rawComments) {
			commentMap.set(comment.id, { ...comment, replies: [] });
		}

		for (const comment of rawComments) {
			const current = commentMap.get(comment.id)!;
			if (comment.parentId && commentMap.has(comment.parentId)) {
				commentMap.get(comment.parentId)!.replies!.push(current);
			} else {
				rootComments.push(current);
			}
		}

		// Sort top-level comments by most recent or most upvoted
		return rootComments.reverse();
	} catch (error) {
		console.error("Error fetching comments:", error);
		return [];
	}
}

/**
 * Fetch all maker updates / changelog entries for a product.
 */
export async function getProductUpdates(
	productId: number,
): Promise<ProductUpdateType[]> {
	try {
		const updates = await db
			.select()
			.from(productUpdates)
			.where(eq(productUpdates.productId, productId))
			.orderBy(desc(productUpdates.createdAt));

		return updates;
	} catch (error) {
		console.error("Error fetching product updates:", error);
		return [];
	}
}

/**
 * Fetch all reviews and calculate statistics for a product.
 */
export async function getProductReviewsWithStats(productId: number): Promise<{
	reviews: ProductReviewType[];
	stats: ReviewStatsType;
}> {
	try {
		const reviews = await db
			.select()
			.from(productReviews)
			.where(eq(productReviews.productId, productId))
			.orderBy(desc(productReviews.createdAt));

		const total = reviews.length;
		if (total === 0) {
			return {
				reviews: [],
				stats: {
					averageRating: 0,
					totalReviews: 0,
					averageUxRating: 0,
					averagePricingRating: 0,
					ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
				},
			};
		}

		let sumRating = 0;
		let sumUx = 0;
		let sumPricing = 0;
		const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

		for (const r of reviews) {
			sumRating += r.rating;
			sumUx += r.uxRating ?? r.rating;
			sumPricing += r.pricingRating ?? r.rating;
			const bucket = Math.min(5, Math.max(1, Math.round(r.rating)));
			distribution[bucket] = (distribution[bucket] || 0) + 1;
		}

		return {
			reviews,
			stats: {
				averageRating: Number((sumRating / total).toFixed(1)),
				totalReviews: total,
				averageUxRating: Number((sumUx / total).toFixed(1)),
				averagePricingRating: Number((sumPricing / total).toFixed(1)),
				ratingDistribution: distribution,
			},
		};
	} catch (error) {
		console.error("Error fetching product reviews:", error);
		return {
			reviews: [],
			stats: {
				averageRating: 0,
				totalReviews: 0,
				averageUxRating: 0,
				averagePricingRating: 0,
				ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
			},
		};
	}
}

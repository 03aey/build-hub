"use server";

import { db } from "@/db";
import { comments, productReviews, productUpdates, products } from "@/db/schema";
import { FormState } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
	commentSchema,
	reviewSchema,
	updateSchema,
} from "./validations";

// ==========================================
// 1. COMMENTS & NESTED DISCUSSIONS
// ==========================================

export async function addCommentAction(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	try {
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to post a comment or join the discussion.",
			};
		}

		const user = await currentUser();
		const rawData = Object.fromEntries(formData.entries());
		const validated = commentSchema.safeParse(rawData);

		if (!validated.success) {
			const fieldErrors = validated.error.flatten().fieldErrors;
			const firstError =
				Object.values(fieldErrors).flat()[0] ||
				"Please enter a valid comment (2–2000 characters).";
			return {
				success: false,
				errors: fieldErrors,
				message: firstError,
			};
		}

		const { productId, parentId, content, category } = validated.data;

		// Fetch product to determine user role and slug
		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		if (!product) {
			return { success: false, message: "Product not found." };
		}

		// Check if current user is the maker of the product
		const isMaker =
			product.userId === userId ||
			(product.submittedBy &&
				user?.primaryEmailAddress?.emailAddress === product.submittedBy);

		const userName =
			user?.fullName ||
			user?.username ||
			user?.firstName ||
			user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
			"Community Member";
		const userAvatar = user?.imageUrl || null;
		const userRole = isMaker ? "maker" : "user";

		await db.insert(comments).values({
			productId,
			userId,
			userName,
			userAvatar,
			userRole,
			parentId: parentId || null,
			content,
			category,
			upvotes: 0,
			upvotedBy: [],
		});

		revalidatePath(`/products/${product.slug}`);
		return {
			success: true,
			message: parentId
				? "Reply posted successfully!"
				: "Comment posted successfully!",
		};
	} catch (error) {
		console.error("Error adding comment:", error);
		return {
			success: false,
			message: "Failed to post comment due to a server error. Please try again.",
		};
	}
}

export async function upvoteCommentAction(commentId: number) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Please sign in to upvote." };
		}

		const [comment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))
			.limit(1);

		if (!comment) {
			return { success: false, message: "Comment not found." };
		}

		const upvotedBy = comment.upvotedBy ?? [];
		const hasUpvoted = upvotedBy.includes(userId);

		let nextUpvotedBy: string[];
		let voteDelta: number;

		if (hasUpvoted) {
			nextUpvotedBy = upvotedBy.filter((id) => id !== userId);
			voteDelta = -1;
		} else {
			nextUpvotedBy = [...upvotedBy, userId];
			voteDelta = 1;
		}

		await db
			.update(comments)
			.set({
				upvotedBy: nextUpvotedBy,
				upvotes: sql`GREATEST(0, ${comments.upvotes} + ${voteDelta})`,
			})
			.where(eq(comments.id, commentId));

		// Get product slug to revalidate
		const [product] = await db
			.select({ slug: products.slug })
			.from(products)
			.where(eq(products.id, comment.productId))
			.limit(1);

		if (product) {
			revalidatePath(`/products/${product.slug}`);
		}

		return { success: true, isUpvoted: !hasUpvoted };
	} catch (error) {
		console.error("Error upvoting comment:", error);
		return { success: false, message: "Failed to upvote." };
	}
}

export async function deleteCommentAction(commentId: number) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Unauthorized. Please sign in." };
		}

		const [comment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))
			.limit(1);

		if (!comment) {
			return { success: false, message: "Comment not found." };
		}

		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, comment.productId))
			.limit(1);

		// Only comment owner or product maker can delete
		const isOwner = comment.userId === userId;
		const isMaker = product?.userId === userId;

		if (!isOwner && !isMaker) {
			return { success: false, message: "You do not have permission to delete this comment." };
		}

		// Delete comment and its replies
		await db.delete(comments).where(eq(comments.parentId, commentId));
		await db.delete(comments).where(eq(comments.id, commentId));

		if (product) {
			revalidatePath(`/products/${product.slug}`);
		}

		return { success: true, message: "Comment deleted successfully." };
	} catch (error) {
		console.error("Error deleting comment:", error);
		return { success: false, message: "Failed to delete comment." };
	}
}

// ==========================================
// 2. MAKER CHANGELOG / MILESTONES
// ==========================================

export async function addChangelogAction(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	try {
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to post a changelog update.",
			};
		}

		const rawData = Object.fromEntries(formData.entries());
		const validated = updateSchema.safeParse(rawData);

		if (!validated.success) {
			const fieldErrors = validated.error.flatten().fieldErrors;
			const firstError =
				Object.values(fieldErrors).flat()[0] ||
				"Please fill out all required changelog fields properly.";
			return {
				success: false,
				errors: fieldErrors,
				message: firstError,
			};
		}

		const { productId, version, title, content, category } = validated.data;

		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		if (!product) {
			return { success: false, message: "Product not found." };
		}

		const user = await currentUser();
		const isMaker =
			product.userId === userId ||
			(product.submittedBy &&
				user?.primaryEmailAddress?.emailAddress === product.submittedBy);

		if (!isMaker) {
			return {
				success: false,
				message: "Only the verified maker of this product can publish changelog updates.",
			};
		}

		await db.insert(productUpdates).values({
			productId,
			userId,
			version: version || null,
			title,
			content,
			category,
		});

		revalidatePath(`/products/${product.slug}`);
		return {
			success: true,
			message: "Changelog update published successfully!",
		};
	} catch (error) {
		console.error("Error adding changelog:", error);
		return {
			success: false,
			message: "Failed to post changelog update due to a server error.",
		};
	}
}

export async function deleteChangelogAction(updateId: number) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Unauthorized. Please sign in." };
		}

		const [update] = await db
			.select()
			.from(productUpdates)
			.where(eq(productUpdates.id, updateId))
			.limit(1);

		if (!update) {
			return { success: false, message: "Changelog update not found." };
		}

		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, update.productId))
			.limit(1);

		if (update.userId !== userId && product?.userId !== userId) {
			return { success: false, message: "Permission denied. Only the author can delete this update." };
		}

		await db.delete(productUpdates).where(eq(productUpdates.id, updateId));

		if (product) {
			revalidatePath(`/products/${product.slug}`);
		}

		return { success: true, message: "Changelog update removed successfully." };
	} catch (error) {
		console.error("Error deleting update:", error);
		return { success: false, message: "Failed to delete changelog update." };
	}
}

// ==========================================
// 3. STRUCTURED REVIEWS & FEEDBACK
// ==========================================

export async function addReviewAction(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	try {
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to submit a review.",
			};
		}

		const user = await currentUser();
		const rawData = Object.fromEntries(formData.entries());
		const validated = reviewSchema.safeParse(rawData);

		if (!validated.success) {
			const fieldErrors = validated.error.flatten().fieldErrors;
			const firstError =
				Object.values(fieldErrors).flat()[0] ||
				"Please complete all required review fields.";
			return {
				success: false,
				errors: fieldErrors,
				message: firstError,
			};
		}

		const {
			productId,
			rating,
			uxRating,
			pricingRating,
			title,
			content,
			pros,
			cons,
		} = validated.data;

		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		if (!product) {
			return { success: false, message: "Product not found." };
		}

		const userName =
			user?.fullName ||
			user?.username ||
			user?.firstName ||
			"Verified Reviewer";
		const userAvatar = user?.imageUrl || null;

		// Check if user already reviewed this product
		const [existingReview] = await db
			.select()
			.from(productReviews)
			.where(
				sql`${productReviews.productId} = ${productId} AND ${productReviews.userId} = ${userId}`,
			)
			.limit(1);

		if (existingReview) {
			// Update existing review
			await db
				.update(productReviews)
				.set({
					userName,
					userAvatar,
					rating,
					uxRating: uxRating ?? rating,
					pricingRating: pricingRating ?? rating,
					title,
					content,
					pros: pros || null,
					cons: cons || null,
					updatedAt: new Date(),
				})
				.where(eq(productReviews.id, existingReview.id));

			revalidatePath(`/products/${product.slug}`);
			return {
				success: true,
				message: "Your review has been updated successfully!",
			};
		}

		await db.insert(productReviews).values({
			productId,
			userId,
			userName,
			userAvatar,
			rating,
			uxRating: uxRating ?? rating,
			pricingRating: pricingRating ?? rating,
			title,
			content,
			pros: pros || null,
			cons: cons || null,
			isVerifiedUser: "true",
		});

		revalidatePath(`/products/${product.slug}`);
		return {
			success: true,
			message: "Thank you for your review and feedback!",
		};
	} catch (error) {
		console.error("Error adding review:", error);
		return {
			success: false,
			message: "Failed to submit review due to a server error. Please try again.",
		};
	}
}

export async function deleteReviewAction(reviewId: number) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Unauthorized. Please sign in." };
		}

		const [review] = await db
			.select()
			.from(productReviews)
			.where(eq(productReviews.id, reviewId))
			.limit(1);

		if (!review) {
			return { success: false, message: "Review not found." };
		}

		if (review.userId !== userId) {
			return { success: false, message: "Permission denied. You can only delete your own reviews." };
		}

		const [product] = await db
			.select({ slug: products.slug })
			.from(products)
			.where(eq(products.id, review.productId))
			.limit(1);

		await db.delete(productReviews).where(eq(productReviews.id, reviewId));

		if (product) {
			revalidatePath(`/products/${product.slug}`);
		}

		return { success: true, message: "Review removed successfully." };
	} catch (error) {
		console.error("Error deleting review:", error);
		return { success: false, message: "Failed to delete review." };
	}
}

import { z } from "zod";

export const commentSchema = z.object({
	productId: z.coerce.number().int().positive("Invalid product ID"),
	parentId: z.coerce.number().int().positive().optional().nullable(),
	category: z
		.enum(["general", "question", "feedback", "bug"])
		.default("general"),
	content: z
		.string()
		.trim()
		.min(2, "Comment must be at least 2 characters long")
		.max(2000, "Comment cannot exceed 2000 characters"),
});

export const updateSchema = z.object({
	productId: z.coerce.number().int().positive("Invalid product ID"),
	version: z.string().trim().max(50).optional().or(z.literal("")),
	category: z
		.enum(["feature", "milestone", "improvement", "fix"])
		.default("feature"),
	title: z
		.string()
		.trim()
		.min(3, "Title must be at least 3 characters long")
		.max(150, "Title cannot exceed 150 characters"),
	content: z
		.string()
		.trim()
		.min(10, "Update content must be at least 10 characters long")
		.max(5000, "Update content cannot exceed 5000 characters"),
});

export const reviewSchema = z.object({
	productId: z.coerce.number().int().positive("Invalid product ID"),
	rating: z.coerce
		.number()
		.int()
		.min(1, "Please provide an overall rating")
		.max(5),
	uxRating: z.coerce.number().int().min(1).max(5).optional().default(5),
	pricingRating: z.coerce.number().int().min(1).max(5).optional().default(5),
	title: z
		.string()
		.trim()
		.min(3, "Review title must be at least 3 characters long")
		.max(150, "Review title cannot exceed 150 characters"),
	pros: z
		.string()
		.trim()
		.max(500, "Pros cannot exceed 500 characters")
		.optional()
		.or(z.literal("")),
	cons: z
		.string()
		.trim()
		.max(500, "Cons cannot exceed 500 characters")
		.optional()
		.or(z.literal("")),
	content: z
		.string()
		.trim()
		.min(10, "Review content must be at least 10 characters long")
		.max(3000, "Review content cannot exceed 3000 characters"),
});

export type CommentInput = z.infer<typeof commentSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { FormState } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { productSchema } from "./product-validations";

export const addProductAction = async (
	prevState: FormState,
	formData: FormData,
): Promise<FormState> => {
	try {
		const { userId, orgId } = await auth();

		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to submit a product.",
			};
		}

		if (!orgId) {
			return {
				success: false,
				message:
					"You must be a member of an active organization to submit a product.",
			};
		}

		const user = await currentUser();
		const userEmail =
			user?.primaryEmailAddress?.emailAddress || "anonymous";

		const rawFormData = Object.fromEntries(formData.entries());
		const validatedData = productSchema.safeParse(rawFormData);

		if (!validatedData.success) {
			return {
				success: false,
				errors: validatedData.error.flatten().fieldErrors,
				message: "Please fix the validation errors below and try again.",
			};
		}

		const { name, slug, tagline, description, websiteUrl, tags } =
			validatedData.data;

		// Check for slug uniqueness
		const [existingSlug] = await db
			.select({ id: products.id })
			.from(products)
			.where(eq(products.slug, slug))
			.limit(1);

		if (existingSlug) {
			return {
				success: false,
				errors: {
					slug: [
						"A product with this slug already exists. Please choose a unique slug.",
					],
				},
				message: "This product slug is already taken. Please choose another one.",
			};
		}

		await db.insert(products).values({
			name,
			slug,
			tagline,
			description: description || null,
			websiteUrl,
			tags,
			status: "pending",
			submittedBy: userEmail,
			organizationId: orgId,
			userId,
		});

		revalidatePath("/");
		revalidatePath("/explore");

		return {
			success: true,
			message:
				"Product submitted successfully. Your submission will be reviewed by administrators shortly.",
		};
	} catch (error: any) {
		console.error("Error submitting product:", error);

		// Handle Postgres unique constraint violation
		if (error?.code === "23505" || error?.message?.includes("unique")) {
			return {
				success: false,
				errors: {
					slug: ["A product with this slug already exists. Please choose a unique slug."],
				},
				message: "A product with this slug already exists.",
			};
		}

		if (error instanceof z.ZodError) {
			return {
				success: false,
				errors: error.flatten().fieldErrors,
				message: "Validation failed. Please check your inputs.",
			};
		}

		return {
			success: false,
			message: "Failed to submit product due to a server error. Please try again later.",
		};
	}
};

// ---------------- UPVOTE ----------------
export const upvoteProductAction = async (productId: number) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Not authenticated" };
		}

		const existing = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		const product = existing[0];

		if (!product) {
			return { success: false, message: "Product not found" };
		}

		const votedBy = product.votedBy ?? [];

		if (votedBy.includes(userId)) {
			return { success: false, message: "Already voted" };
		}

		await db
			.update(products)
			.set({
				votedBy: [...votedBy, userId],
				voteCount: sql`${products.voteCount} + 1`,
			})
			.where(eq(products.id, productId));

		revalidatePath("/");
		revalidatePath("/explore");
		revalidatePath(`/products/${product.slug}`);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
};

// ---------------- DOWNVOTE ----------------
export const downvoteProductAction = async (productId: number) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Not authenticated" };
		}

		const existing = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		const product = existing[0];

		if (!product) {
			return { success: false, message: "Product not found" };
		}

		const votedBy = product.votedBy ?? [];

		if (!votedBy.includes(userId)) {
			return { success: false, message: "Not voted yet" };
		}

		await db
			.update(products)
			.set({
				votedBy: votedBy.filter((id) => id !== userId),
				voteCount: sql`${products.voteCount} - 1`,
			})
			.where(eq(products.id, productId));

		revalidatePath("/");
		revalidatePath("/explore");
		revalidatePath(`/products/${product.slug}`);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
};

export const getVoteStatusAction = async (productId: number) => {
	const { userId } = await auth();

	if (!userId) return false;

	const product = await db
		.select({ votedBy: products.votedBy })
		.from(products)
		.where(eq(products.id, productId))
		.limit(1);

	const votedBy = product?.[0]?.votedBy ?? [];

	return votedBy.includes(userId);
};

"use server";

import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { FormState } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { productSchema } from "./product-validations";

export const addProductAction = async (
	prevState: FormState,
	formData: FormData,
) => {
	try {
		const { userId, orgId } = await auth();

		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to submit a product",
				errors: undefined,
			};
		}

		if (!orgId) {
			return {
				success: false,
				message:
					"You must be a member of an organization to submit a product",
				errors: undefined,
			};
		}

		const user = await currentUser();
		const userEmail =
			user?.primaryEmailAddress?.emailAddress || "anonymous";

		const rawFormData = Object.fromEntries(formData.entries());

		const validatedData = productSchema.safeParse(rawFormData);

		if (!validatedData.success) {
			console.log(validatedData.error.flatten().fieldErrors);
			return {
				success: false,
				errors: validatedData.error.flatten().fieldErrors,
				message: "Invalid data",
			};
		}
		const { name, slug, tagline, description, websiteUrl, tags } =
			validatedData.data;

		const tagsArray = tags
			? tags.filter((tag) => typeof tag === "string")
			: [];

		await db.insert(products).values({
			name,
			slug,
			tagline,
			description,
			websiteUrl,
			tags: tagsArray,
			status: "pending",
			submittedBy: userEmail,
			organizationId: orgId,
			userId,
		});

		return {
			success: true,
			message:
				"Product submitted successfully! It will be reviewed shortly.",
			errors: undefined,
		};
	} catch (error) {
		console.error(error);

		if (error instanceof z.ZodError) {
			return {
				success: false,
				errors: error.flatten().fieldErrors,
				message: "Validation failed. Please check the form.",
			};
		}

		return {
			success: false,
			errors: undefined,
			message: "Failed to submit product",
		};
	}
};

// ---------------- CHECK VOTE ----------------
export const hasUserVoted = async (userId: string, productId: number) => {
	const existing = await db
		.select()
		.from(votes)
		.where(and(eq(votes.userId, userId), eq(votes.productId, productId)));

	return !!existing;
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
			.from(votes)
			.where(
				and(eq(votes.userId, userId), eq(votes.productId, productId)),
			);

		if (existing.length > 0) {
			return { success: false, message: "Already voted" };
		}

		await db.insert(votes).values({
			userId,
			productId,
		});

		await db
			.update(products)
			.set({
				voteCount: sql`vote_count + 1`,
			})
			.where(eq(products.id, productId));

		revalidatePath("/");
		revalidatePath("/explore");

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
			return { success: false };
		}

		const existing = await db
			.select()
			.from(votes)
			.where(
				and(eq(votes.userId, userId), eq(votes.productId, productId)),
			);

		if (existing.length === 0) {
			return { success: false, message: "Not voted yet" };
		}

		await db.delete(votes).where(eq(votes.id, existing[0].id));

		await db
			.update(products)
			.set({
				voteCount: sql`GREATEST(0, vote_count - 1)`,
			})
			.where(eq(products.id, productId));

		revalidatePath("/");
		revalidatePath("/explore");

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
};

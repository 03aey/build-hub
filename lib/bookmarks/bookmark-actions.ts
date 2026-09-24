"use server";

import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateBookmarkSchema = z.object({
	bookmarkId: z.number().int().positive(),
	listName: z.string().trim().min(1).max(100),
	notes: z.string().max(500).optional().nullable(),
	path: z.string().optional(),
});

const deleteBookmarkSchema = z.object({
	bookmarkId: z.number().int().positive(),
	path: z.string().optional(),
});

/**
 * Direct toggle helper without form data (for client components).
 */
export async function directToggleBookmarkAction(params: {
	productId: number;
	listName?: string;
	notes?: string | null;
	path?: string;
}) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return {
				success: false,
				isBookmarked: false,
				message: "Please sign in to save products to your bookmarks.",
			};
		}

		const list = params.listName?.trim() || "Want to Test";

		// Check if exists
		const [existing] = await db
			.select()
			.from(bookmarks)
			.where(
				and(
					eq(bookmarks.userId, userId),
					eq(bookmarks.productId, params.productId),
				),
			)
			.limit(1);

		if (existing) {
			await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));

			revalidatePath("/bookmarks");
			if (params.path) revalidatePath(params.path);

			return {
				success: true,
				isBookmarked: false,
				message: "Removed from bookmarks",
			};
		}

		const [created] = await db
			.insert(bookmarks)
			.values({
				userId,
				productId: params.productId,
				listName: list,
				notes: params.notes || null,
			})
			.returning();

		revalidatePath("/bookmarks");
		if (params.path) revalidatePath(params.path);

		return {
			success: true,
			isBookmarked: true,
			bookmarkId: created.id,
			listName: created.listName,
			message: `Saved to "${created.listName}" list.`,
		};
	} catch (error) {
		console.error("Error in directToggleBookmarkAction:", error);
		return {
			success: false,
			isBookmarked: false,
			message: "Failed to toggle bookmark.",
		};
	}
}

/**
 * Save or update bookmark to a specific list with optional notes.
 */
export async function saveBookmarkWithListAction(params: {
	productId: number;
	listName: string;
	notes?: string | null;
	path?: string;
}) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return {
				success: false,
				isBookmarked: false,
				message: "Please sign in to save products to your playlists.",
			};
		}

		const list = params.listName.trim() || "Want to Test";

		// Check if already exists
		const [existing] = await db
			.select()
			.from(bookmarks)
			.where(
				and(
					eq(bookmarks.userId, userId),
					eq(bookmarks.productId, params.productId),
				),
			)
			.limit(1);

		if (existing) {
			// Update list and notes
			const [updated] = await db
				.update(bookmarks)
				.set({
					listName: list,
					notes: params.notes ?? existing.notes,
				})
				.where(eq(bookmarks.id, existing.id))
				.returning();

			revalidatePath("/bookmarks");
			if (params.path) revalidatePath(params.path);

			return {
				success: true,
				isBookmarked: true,
				bookmarkId: updated.id,
				listName: updated.listName,
				message: `Updated to "${updated.listName}" list.`,
			};
		}

		// Insert new bookmark
		const [created] = await db
			.insert(bookmarks)
			.values({
				userId,
				productId: params.productId,
				listName: list,
				notes: params.notes || null,
			})
			.returning();

		revalidatePath("/bookmarks");
		if (params.path) revalidatePath(params.path);

		return {
			success: true,
			isBookmarked: true,
			bookmarkId: created.id,
			listName: created.listName,
			message: `Saved to "${created.listName}" list.`,
		};
	} catch (error) {
		console.error("Error in saveBookmarkWithListAction:", error);
		return {
			success: false,
			isBookmarked: false,
			message: "Failed to save product to list.",
		};
	}
}

/**
 * Update an existing bookmark's list category or personal notes.
 */
export async function updateBookmarkDetailsAction(params: {
	bookmarkId: number;
	listName: string;
	notes?: string | null;
	path?: string;
}) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Unauthorized." };
		}

		const validated = updateBookmarkSchema.safeParse(params);
		if (!validated.success) {
			return {
				success: false,
				message: "Invalid list name or notes format.",
			};
		}

		const [updated] = await db
			.update(bookmarks)
			.set({
				listName: validated.data.listName,
				notes: validated.data.notes || null,
			})
			.where(
				and(
					eq(bookmarks.id, validated.data.bookmarkId),
					eq(bookmarks.userId, userId),
				),
			)
			.returning();

		if (!updated) {
			return { success: false, message: "Bookmark not found." };
		}

		revalidatePath("/bookmarks");
		if (params.path) revalidatePath(params.path);

		return {
			success: true,
			message: `Updated bookmark in "${updated.listName}".`,
		};
	} catch (error) {
		console.error("Error in updateBookmarkDetailsAction:", error);
		return { success: false, message: "Failed to update bookmark." };
	}
}

/**
 * Delete a bookmark by ID.
 */
export async function removeBookmarkAction(params: {
	bookmarkId: number;
	path?: string;
}) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return { success: false, message: "Unauthorized." };
		}

		const validated = deleteBookmarkSchema.safeParse(params);
		if (!validated.success) {
			return { success: false, message: "Invalid bookmark ID." };
		}

		await db
			.delete(bookmarks)
			.where(
				and(
					eq(bookmarks.id, validated.data.bookmarkId),
					eq(bookmarks.userId, userId),
				),
			);

		revalidatePath("/bookmarks");
		if (params.path) revalidatePath(params.path);

		return { success: true, message: "Bookmark removed." };
	} catch (error) {
		console.error("Error in removeBookmarkAction:", error);
		return { success: false, message: "Failed to remove bookmark." };
	}
}

import { db } from "@/db";
import { bookmarks, products } from "@/db/schema";
import { BookmarkListSummaryType, BookmarkWithProductType } from "@/types";
import { and, desc, eq, inArray } from "drizzle-orm";

/**
 * Retrieve all bookmarks saved by a specific user, optionally filtered by list name.
 */
export async function getUserBookmarks(
	userId: string,
	listName?: string,
): Promise<BookmarkWithProductType[]> {
	if (!userId) return [];

	try {
		const baseQuery = db
			.select({
				bookmark: bookmarks,
				product: products,
			})
			.from(bookmarks)
			.innerJoin(products, eq(bookmarks.productId, products.id));

		const query =
			listName && listName !== "all"
				? baseQuery.where(
						and(
							eq(bookmarks.userId, userId),
							eq(bookmarks.listName, listName),
						),
					)
				: baseQuery.where(eq(bookmarks.userId, userId));

		const results = await query.orderBy(desc(bookmarks.createdAt));

		return results.map((r) => ({
			...r.bookmark,
			product: r.product,
		}));
	} catch (error) {
		console.error("Error fetching user bookmarks:", error);
		return [];
	}
}

/**
 * Check if a product is bookmarked by a user. Returns bookmark details if saved.
 */
export async function isProductBookmarked(
	userId: string,
	productId: number,
): Promise<{
	isBookmarked: boolean;
	bookmarkId?: number;
	listName?: string;
	notes?: string | null;
}> {
	if (!userId || !productId) {
		return { isBookmarked: false };
	}

	try {
		const [entry] = await db
			.select()
			.from(bookmarks)
			.where(
				and(
					eq(bookmarks.userId, userId),
					eq(bookmarks.productId, productId),
				),
			)
			.limit(1);

		if (!entry) {
			return { isBookmarked: false };
		}

		return {
			isBookmarked: true,
			bookmarkId: entry.id,
			listName: entry.listName,
			notes: entry.notes,
		};
	} catch (error) {
		console.error("Error checking product bookmark:", error);
		return { isBookmarked: false };
	}
}

/**
 * Get distinct lists created by a user with count of products in each list.
 */
export async function getUserBookmarkLists(
	userId: string,
): Promise<BookmarkListSummaryType[]> {
	if (!userId) return [];

	try {
		const userBookmarks = await db
			.select({
				listName: bookmarks.listName,
			})
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId));

		const countMap: Record<string, number> = {};
		for (const b of userBookmarks) {
			const name = b.listName || "Want to Test";
			countMap[name] = (countMap[name] || 0) + 1;
		}

		return Object.entries(countMap).map(([name, count]) => ({
			name,
			count,
		}));
	} catch (error) {
		console.error("Error fetching user bookmark lists:", error);
		return [];
	}
}

/**
 * (UNUSED) Retrieve array of product IDs bookmarked by user for fast multi-product card badges.
 */
export async function getUserBookmarkedProductIds(
	userId: string,
): Promise<number[]> {
	if (!userId) return [];

	try {
		const rows = await db
			.select({ productId: bookmarks.productId })
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId));

		return rows.map((r) => r.productId);
	} catch (error) {
		console.error("Error fetching bookmarked product IDs:", error);
		return [];
	}
}

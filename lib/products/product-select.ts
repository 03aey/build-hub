import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { connection } from "next/server";

export async function getFeaturedProducts(userId: string | null) {
	"use cache";
	const productsData = await db
		.select()
		.from(products)
		.where(eq(products.status, "approved"))
		.orderBy(desc(products.createdAt));

	const userVotes = userId
		? await db.select().from(votes).where(eq(votes.userId, userId))
		: [];

	const votedSet = new Set(userVotes.map((v) => v.productId));

	return productsData.map((product) => ({
		...product,
		hasVoted: votedSet.has(product.id),
	}));
}

export async function getAllProductsAdmin() {
	const productsData = await db
		.select()
		.from(products)
		.orderBy(desc(products.createdAt));

	return productsData;
}

export async function getAllProducts(userId: string | null) {
	const productsData = await db
		.select()
		.from(products)
		.where(eq(products.status, "approved"))
		.orderBy(desc(products.createdAt));

	const userVotes = userId
		? await db.select().from(votes).where(eq(votes.userId, userId))
		: [];

	const votedSet = new Set(userVotes.map((v) => v.productId));

	return {
		products: productsData.map((product) => ({
			...product,
			hasVoted: votedSet.has(product.id),
		})),
	};
}

export async function getRecentlyLaunchedProducts(userId: string | null) {
	await connection();
	const productsData = await getAllProducts(userId);

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	return productsData.products.filter(
		(product) => product.createdAt && product.createdAt >= oneWeekAgo,
	);
}

export async function getProductBySlug(slug: string, userId: string | null) {
	const product = await db
		.select()
		.from(products)
		.where(eq(products.slug, slug))
		.limit(1);

	if (!product[0]) return null;

	const foundProduct = product[0];

	let hasVoted = false;

	if (userId) {
		const vote = await db
			.select({ id: votes.id })
			.from(votes)
			.where(
				and(
					eq(votes.userId, userId),
					eq(votes.productId, foundProduct.id),
				),
			)
			.limit(1);

		hasVoted = vote.length > 0;
	}

	return {
		...foundProduct,
		hasVoted,
	};
}

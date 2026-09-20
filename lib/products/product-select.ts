import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";

export async function getAllProductsAdmin() {
	const productsData = await db
		.select()
		.from(products)
		.orderBy(desc(products.createdAt));

	return productsData;
}

export async function getAllProducts() {
	"use cache";
	const productsData = await db
		.select()
		.from(products)
		.where(eq(products.status, "approved"))
		.orderBy(desc(products.createdAt));

	return productsData;
}

export async function getRecentlyLaunchedProducts() {
	await connection();
	const productsData = await getAllProducts();

	const twoWeekAgo = new Date();
	twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);

	return productsData.filter(
		(product) => product.createdAt && product.createdAt >= twoWeekAgo,
	);
}

export async function getProductBySlug(slug: string) {
	"use cache";
	const product = await db
		.select()
		.from(products)
		.where(eq(products.slug, slug))
		.limit(1);

	return product?.[0] ?? null;
}

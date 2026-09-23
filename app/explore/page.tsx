"use cache";

import SectionHeader from "@/components/common/section-header";
import ProductExplorer from "@/components/products/product-explorer";
import { ProductsSkeleton } from "@/components/skeleton";
import { getAllProducts } from "@/lib/products/product-select";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Explore Products - BuildHub",
	description: "Browse and discover amazing projects from our community",
};

export default async function ExplorePage() {
	const products = await getAllProducts();

	return (
		<div className="pb-20 pt-4">
			<div className="wrapper">
				<div className="mb-4">
					<SectionHeader
						title="Explore Products"
						description="Browse and discover amazing projects from our community"
					/>
				</div>

				<Suspense fallback={<ProductsSkeleton count={8} />}>
					<ProductExplorer products={products} />
				</Suspense>
			</div>
		</div>
	);
}

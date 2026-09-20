"use cache";

import SectionHeader from "@/components/common/section-header";
import ProductExplorer from "@/components/products/product-explorer";
import { getAllProducts } from "@/lib/products/product-select";
import { Loader2, ZodiacAries } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Explore Products - BuildHub",
	description: "Browse and discover amazing projects from our community",
};

export default async function ExplorePage() {
	const products = await getAllProducts();

	return (
		<div className="py-20 pt-10">
			<div className="wrapper">
				<div className="mb-12">
					<SectionHeader
						title="Explore Products"
						icon={ZodiacAries}
						description="Browse and discover amazing projects from our community"
					/>
				</div>

				<Suspense
					fallback={
						<div className="flex items-center justify-center w-full min-h-screen">
							<Loader2 className="size-5 animate-spin" />
						</div>
					}
				>
					<ProductExplorer products={products} />
				</Suspense>
			</div>
		</div>
	);
}

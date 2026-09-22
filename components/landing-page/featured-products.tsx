"use cache";

import EmptyState from "@/components/common/empty-state";
import SectionHeader from "@/components/common/section-header";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/products/product-select";
import { Birdhouse, ChevronsRight } from "lucide-react";
import Link from "next/link";

export default async function FeaturedProducts() {
	const products = await getAllProducts();
	const featuredProducts = products.filter(
		(product) => product.voteCount > 500,
	);

	return (
		<section className="py-20 bg-muted/20" id="trending">
			<div className="wrapper">
				<div className="flex items-center justify-between mb-6">
					<SectionHeader
						title="Featured Today"
						icon={Birdhouse}
						description="Top picks from our community this week"
					/>
					<Button
						variant="outline"
						asChild
						className="hidden sm:flex"
					>
						<Link href="/explore?sort=trending">
							View All <ChevronsRight className="size-4" />
						</Link>
					</Button>
				</div>

				{featuredProducts.length > 0 ? (
					<div className="grid-wrapper min-h-100">
						{featuredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<EmptyState
						header="No Featured Products Today"
						message="No products have reached 500 upvotes yet. Be the first to feature a product."
					/>
				)}
			</div>
		</section>
	);
}

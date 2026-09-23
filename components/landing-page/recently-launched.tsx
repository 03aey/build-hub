import EmptyState from "@/components/common/empty-state";
import SectionHeader from "@/components/common/section-header";
import ProductCard from "@/components/products/product-card";
import { ProductsSkeleton } from "@/components/skeleton";
import { getRecentlyLaunchedProducts } from "@/lib/products/product-select";
import { RotateCwSquare } from "lucide-react";
import { Suspense } from "react";

export default function RecentlyLaunched() {
	return (
		<section className="py-20">
			<div className="wrapper space-y-6">
				<SectionHeader
					title="Recently Launched"
					icon={RotateCwSquare}
					description="Discover the latest products from our community"
				/>

				<Suspense fallback={<ProductsSkeleton />}>
					<RecentlyLaunchedProducts />
				</Suspense>
			</div>
		</section>
	);
}

async function RecentlyLaunchedProducts() {
	const recentlyLaunchedProducts = await getRecentlyLaunchedProducts();

	return recentlyLaunchedProducts.length > 0 ? (
		<div className="grid-wrapper min-h-100">
			{recentlyLaunchedProducts.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	) : (
		<EmptyState
			header="No products launched in the last week"
			message="Check back soon for new launches. Why not be the first to launch a product?"
		/>
	);
}

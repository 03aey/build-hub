"use client";

import { Pagination } from "@/components/pagination";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductType } from "@/types";
import { BookSearch, FolderClock, TrendingUpIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ProductExplorer({
	products,
}: {
	products: ProductType[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// ================= Initialize from URL =================
	const initialSort =
		(searchParams.get("sort") as "trending" | "recent") || "recent";
	const initialQuery = searchParams.get("q") || "";

	const [sortBy, setSortBy] = useState<"trending" | "recent">(initialSort);
	const [searchQuery, setSearchQuery] = useState(initialQuery);

	// ================= Update URL =================
	useEffect(() => {
		const currentParams = new URLSearchParams(searchParams.toString());

		const currentSort = currentParams.get("sort") || "recent";
		const currentQuery = currentParams.get("q") || "";

		if (currentSort === sortBy && currentQuery === searchQuery) {
			return;
		}

		currentParams.set("sort", sortBy);

		if (searchQuery) currentParams.set("q", searchQuery);
		else currentParams.delete("q");

		router.replace(`${pathname}?${currentParams.toString()}`, {
			scroll: false,
		});
	}, [sortBy, searchQuery, router, pathname, searchParams]);

	// ================= Filtering =================
	const filteredProducts = useMemo(() => {
		const filtered = [...products];

		if (searchQuery.length > 0) {
			return filtered.filter((product) =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		switch (sortBy) {
			case "trending":
				return filtered.sort((a, b) => b.voteCount - a.voteCount);

			case "recent":
				return filtered.sort(
					(a, b) =>
						new Date(b.createdAt || "").getTime() -
						new Date(a.createdAt || "").getTime(),
				);

			default:
				return filtered;
		}
	}, [searchQuery, products, sortBy]);

	// ================= Pagination =================
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	const paginatedProducts = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;

		return filteredProducts.slice(start, end);
	}, [filteredProducts, currentPage]);

	useEffect(() => {
		const handlePageChange = () => {
			setCurrentPage(1);
		};

		handlePageChange();
	}, [searchQuery, sortBy]);

	return (
		<div>
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<div className="flex-1 relative">
					<BookSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
					<Input
						type="text"
						placeholder="Search products..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="flex gap-2">
					<Button
						variant={sortBy === "trending" ? "default" : "outline"}
						onClick={() => setSortBy("trending")}
					>
						<TrendingUpIcon className="size-4" />
						Trending
					</Button>

					<Button
						variant={sortBy === "recent" ? "default" : "outline"}
						onClick={() => setSortBy("recent")}
					>
						<FolderClock className="size-4" />
						Recent
					</Button>
				</div>
			</div>

			<div className="mb-6">
				<p className="text-sm text-muted-foreground">
					{paginatedProducts.length > 0
						? `Showing ${paginatedProducts.length} of ${filteredProducts.length} products`
						: "No products found."}
				</p>
			</div>

			<div className="grid-wrapper min-h-107">
				{paginatedProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page)}
			/>
		</div>
	);
}

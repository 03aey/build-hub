import BackButton from "@/components/back-button";
import SectionHeader from "@/components/common/section-header";
import CommunityTabs from "@/components/community/community-tabs";
import BookmarkButton from "@/components/products/bookmark-button";
import VotingButtons from "@/components/products/voting-buttons";
import { ProductDetailSkeleton } from "@/components/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isProductBookmarked } from "@/lib/bookmarks/bookmark-select";
import {
	getNestedComments,
	getProductReviewsWithStats,
	getProductUpdates,
} from "@/lib/community/community-select";
import {
	getAllProducts,
	getProductBySlug,
} from "@/lib/products/product-select";
import { formatDate } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
	ChevronsUp,
	FileSymlink,
	LineDotRightHorizontal,
	MessageSquare,
	ShieldUser,
	Star,
	UserStar,
} from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

export const generateStaticParams = async () => {
	const products = await getAllProducts();
	return products.map((product) => ({
		slug: product.slug.toString(),
	}));
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		return {
			title: "Product Not Found - BuildHub",
		};
	}

	return {
		title: `${product.name} - BuildHub`,
		description:
			product.tagline ||
			product.description?.slice(0, 160) ||
			"Explore this product on BuildHub.",
	};
}

export default function Product({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	return (
		<Suspense fallback={<ProductDetailSkeleton />}>
			<ProductContent params={params} />
		</Suspense>
	);
}

async function ProductContent({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	await connection();
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	const { userId } = await auth();
	const user = await currentUser();

	// Check if current authenticated user is the maker of this product
	const isMaker = Boolean(
		userId &&
		(product.userId === userId ||
			(product.submittedBy &&
				user?.primaryEmailAddress?.emailAddress ===
					product.submittedBy)),
	);

	// Fetch community data and bookmark state in parallel
	const [comments, updates, reviewData, bookmarkInfo] = await Promise.all([
		getNestedComments(product.id),
		getProductUpdates(product.id),
		getProductReviewsWithStats(product.id),
		userId
			? isProductBookmarked(userId, product.id)
			: Promise.resolve<{
					isBookmarked: boolean;
					bookmarkId?: number;
					listName?: string;
					notes?: string | null;
				}>({ isBookmarked: false }),
	]);

	const { name, description, websiteUrl, tags, voteCount, tagline } = product;

	return (
		<div className="pb-20 pt-4 min-h-screen">
			<div className="wrapper space-y-8">
				{/* <BackButton /> */}

				{/* Top Hero Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					{/* Left 2 Cols: Main Info */}
					<div className="lg:col-span-2 space-y-6">
						<div>
							<div className="flex flex-wrap items-center gap-2 mb-3">
								{isMaker && (
									<Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-2.5 py-0.5 font-semibold gap-1">
										<ShieldUser className="size-3" />
										You are the maker of this product
									</Badge>
								)}
								{reviewData.stats.totalReviews > 0 && (
									<Badge
										variant="outline"
										className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-semibold gap-1"
									>
										<Star className="size-3 fill-amber-400 text-amber-400" />
										{reviewData.stats.averageRating.toFixed(
											1,
										)}{" "}
										({reviewData.stats.totalReviews}{" "}
										{reviewData.stats.totalReviews === 1
											? "review"
											: "reviews"}
										)
									</Badge>
								)}
								{updates.length > 0 && (
									<Badge
										variant="secondary"
										className="text-xs font-medium gap-1"
									>
										<ChevronsUp className="size-3" />
										{updates.length}{" "}
										{updates.length === 1
											? "update"
											: "updates"}
									</Badge>
								)}
							</div>

							<SectionHeader
								title={name}
								icon={LineDotRightHorizontal}
								description={tagline ?? ""}
							/>

							{tags && tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-4">
									{tags.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="text-xs lowercase"
										>
											{tag}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* About description */}
						<div className="space-y-3">
							<h2 className="text-lg font-bold">
								About the Project
							</h2>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
								{description}
							</p>
						</div>

						<div className="border rounded-lg p-4 bg-primary/10">
							<h2 className="text-lg font-semibold mb-4">
								Product Details
							</h2>

							<div className="space-y-2">
								{[
									{
										label: "Launched on :",
										value: formatDate(product.createdAt),
									},
									{
										label: "Submitted by :",
										value: product.submittedBy,
									},
								].map(({ label, value }) => (
									<div
										key={label}
										className="flex items-center gap-3 text-sm"
									>
										<span className="text-muted-foreground">
											{label}
										</span>
										<span className="font-medium">
											{value}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column: Sticky Action Box */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							<div className="border rounded-lg p-4 bg-background shadow-xs space-y-6">
								<div className="text-center space-y-3">
									<p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
										Support This Project
									</p>
									<VotingButtons
										productId={product.id}
										voteCount={voteCount}
									/>
								</div>

								{voteCount > 500 && (
									<Badge
										variant="outline"
										className="w-full justify-center py-2 tracking-wide"
									>
										🔥 Trending Builder Choice
									</Badge>
								)}

								<div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-1.5">
											<MessageSquare className="size-3.5" />
											Community Comments
										</span>
										<span className="font-bold text-foreground">
											{comments.length}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="flex items-center gap-1.5">
											<UserStar className="size-3.5" />
											Average Rating
										</span>
										<span className="font-bold text-foreground">
											{reviewData.stats.totalReviews > 0
												? `${reviewData.stats.averageRating.toFixed(1)} / 5.0`
												: "No reviews yet"}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="flex items-center gap-1.5">
											<ChevronsUp className="size-3.5" />
											Maker Updates
										</span>
										<span className="font-bold text-foreground">
											{updates.length}
										</span>
									</div>
								</div>

								{/* Bookmark Button */}
								<div className="pt-2 space-y-4">
									<BookmarkButton
										productId={product.id}
										productName={product.name}
										initialIsBookmarked={
											bookmarkInfo.isBookmarked
										}
										initialListName={bookmarkInfo.listName}
										className="w-full rounded-full"
									/>
									{websiteUrl && (
										<Button
											asChild
											className="w-full rounded-full"
										>
											<a
												href={websiteUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												Visit Website{" "}
												<FileSymlink className="size-4 ml-1" />
											</a>
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <Separator /> */}

				{/* Bottom Community Hub (Tabs: Discussion, Changelog, Reviews) */}
				<CommunityTabs
					productId={product.id}
					productName={name}
					productSlug={product.slug}
					isMaker={isMaker}
					comments={comments}
					updates={updates}
					reviews={reviewData.reviews}
					reviewStats={reviewData.stats}
				/>
			</div>
		</div>
	);
}

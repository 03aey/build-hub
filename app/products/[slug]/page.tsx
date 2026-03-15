"use cache";

import BackButton from "@/components/back-button";
import SectionHeader from "@/components/common/section-header";
import VotingButtons from "@/components/products/voting-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	getFeaturedProducts,
	getProductBySlug,
} from "@/lib/products/product-select";
import { FileSymlink, LineDotRightHorizontal, UserMinus } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
	const products = await getFeaturedProducts();
	return products.map((product) => ({
		slug: product.slug.toString(),
	}));
};

export const metadata: Metadata = {
	title: "About Product - BuildHub",
	description:
		"Learn more about this amazing product and support it by voting. Discover features, launch date, and submitter information.",
};

export default async function Product({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	const { name, description, websiteUrl, tags, voteCount, tagline } = product;

	return (
		<div className="py-16 pt-10 min-h-screen">
			<div className="wrapper">
				<BackButton />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
					<div className="lg:col-span-2 space-y-6">
						<div className="flex items-start gap-6">
							<div className="flex-1 min-w-0">
								<div className="mb-6">
									<SectionHeader
										title={name}
										icon={LineDotRightHorizontal}
										description={tagline ?? ""}
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{tags?.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</div>
						<div className="prose prose-neutral dark:prose-invert max-w-none">
							<h2 className="text-xl font-semibold mb-4">
								About
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								{description}
							</p>
						</div>

						<div className="border rounded-lg p-6 bg-primary/10">
							<h2 className="text-lg font-semibold mb-4">
								Product Details
							</h2>

							<div className="space-y-3">
								{[
									{
										label: "Launched:",
										value: new Intl.DateTimeFormat(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "numeric",
											},
										).format(
											new Date(
												product.createdAt?.toISOString() ??
													"",
											),
										),
									},
									{
										label: "Submitted by:",
										value: product.submittedBy,
										icon: UserMinus,
									},
								].map(({ label, value, icon: Icon }) => (
									<div
										key={label}
										className="flex items-center gap-3 text-sm"
									>
										{Icon && (
											<Icon className="size-4 text-muted-foreground" />
										)}
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
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-4">
							<div className="border rounded-lg p-6 bg-background">
								<div className="text-center mb-6">
									<p className="text-sm text-muted-foreground mb-2">
										Support this product
									</p>
									<VotingButtons
										productId={product.id}
										voteCount={voteCount}
									/>
								</div>
								{voteCount > 100 && (
									<div className="pt-6 border-t">
										<Badge className="w-full justify-center py-2">
											🔥 Featured Product
										</Badge>
									</div>
								)}
							</div>
							{websiteUrl && (
								<Button
									asChild
									className="w-full rounded-lg"
									variant={"outline"}
								>
									<a
										href={websiteUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										Visit Website{" "}
										<FileSymlink className="size-4 ml-2" />
									</a>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

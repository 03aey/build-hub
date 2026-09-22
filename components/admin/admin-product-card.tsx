import { cn, formatDate } from "@/lib/utils";
import { ProductType } from "@/types";
import { Tractor } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardFooter, CardTitle } from "../ui/card";
import AdminActions from "./admin-actions";
import AdminDeleteProduct from "./admin-product-delete";

export default function AdminProductCard({
	product,
}: {
	product: ProductType;
}) {
	return (
		<Card className="border rounded-lg p-6 bg-background hover:shadow-md transition-shadow">
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
				<div className="flex-1 min-w-0 space-y-4">
					<CardTitle className="text-xl font-semibold flex justify-between items-center">
						{product.name}

						<Badge
							className={cn(
								product.status === "pending" &&
									"bg-yellow-600/10 text-yellow-600 border-yellow-600",
								product.status === "approved" &&
									"bg-green-500/10 text-green-600 border-green-500",
								product.status === "rejected" &&
									"bg-red-500/10 text-red-500 border-red-500",
							)}
						>
							{product.status}
						</Badge>
					</CardTitle>
					<CardDescription className="flex flex-col gap-4">
						{product.tagline}
						<div className="flex items-center gap-2">
							{product.tags?.map((tag) => (
								<Badge
									variant="secondary"
									className="lowercase"
									key={tag}
								>
									{tag}
								</Badge>
							))}
						</div>
						<div className="flex gap-x-4 gap-y-2 text-sm text-muted-foreground">
							<p>
								<span className="font-bold">By:</span>{" "}
								{product.submittedBy}
							</p>
							<p>{formatDate(product.createdAt)}</p>
							<p>
								<Link
									href={product.websiteUrl ?? ""}
									target="_blank"
									className="flex items-center gap-1 group"
									rel="noopener noreferrer"
								>
									Visit Website{" "}
									<Tractor className="size-5 group-hover:animate-pulse group-hover:text-primary duration-200 transition-colors" />
								</Link>
							</p>
						</div>
					</CardDescription>
					<CardFooter className="px-0">
						<AdminDeleteProduct productId={product.id} />
					</CardFooter>
				</div>
				<div className="lg:shrink-0">
					<AdminActions
						status={product.status ?? ""}
						productId={product.id}
					/>
				</div>
			</div>
		</Card>
	);
}

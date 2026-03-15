import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ProductType } from "@/types";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import VotingButtons from "./voting-buttons";

export default function ProductCard({ product }: { product: ProductType }) {
	return (
		<Link href={`/products/${product.slug}`} className="h-fit">
			<Card className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 min-h-45">
				<CardHeader className="flex-1">
					<div className="flex items-start gap-4">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<CardTitle className="text-lg group-hover:text-primary transition-colors">
									{product.name}
								</CardTitle>
								{product.voteCount > 450 && (
									<Badge className="gap-1 bg-primary text-primary-foreground">
										<StarIcon className="size-3 fill-current" />
										Featured
									</Badge>
								)}
							</div>
							<CardDescription className="line-clamp-3">
								{product.description}
							</CardDescription>
						</div>

						<VotingButtons
							productId={product.id}
							voteCount={product.voteCount}
						/>
					</div>
				</CardHeader>
				<CardFooter>
					<div className="flex items-center gap-2">
						{product.tags?.map((tag: string) => (
							<Badge variant="secondary" key={tag}>
								{tag}
							</Badge>
						))}
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

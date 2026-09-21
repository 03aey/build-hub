import BackButton from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Compass,
	HousePlug,
	PackageSearch,
	PlusCircle,
	Search,
	Sparkles,
	Telescope,
} from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
	return (
		<div className="pb-16 min-h-[70vh]">
			<div className="wrapper max-w-4xl pt-8">
				<div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-8">
					{/* Status Badge */}
					<div className="inline-flex items-center">
						<Badge
							variant="outline"
							className="px-3.5 py-1.5 rounded-full text-xs font-semibold gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-xs"
						>
							<PackageSearch className="size-3.5" />
							404 • Product Not Found
						</Badge>
					</div>

					{/* Center Visual & Title */}
					<div className="space-y-4 max-w-xl mx-auto">
						{/* <div className="relative inline-flex items-center justify-center">
							<div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl transform scale-150 -z-10" />
							<div className="size-20 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md flex items-center justify-center shadow-lg">
							</div>
						</div> */}
						{/* <PackageSearch className="size-10 text-primary animate-pulse mx-auto" /> */}

						<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
							Looking for a Project?
						</h1>

						<p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
							We couldn&apos;t find the product you requested. It might have been
							renamed, unpublished, or the URL slug may contain a typo.
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
						<Button asChild size="lg" className="rounded-full gap-2 px-6 shadow-sm">
							<Link href="/explore">
								<Telescope className="size-4" />
								Explore All Products
							</Link>
						</Button>

						<Button asChild variant="outline" size="lg" className="rounded-full gap-2 px-6">
							<Link href="/submit">
								<PlusCircle className="size-4" />
								Submit a Product
							</Link>
						</Button>

						<Button asChild variant="ghost" size="lg" className="rounded-full gap-2 px-5 text-muted-foreground hover:text-foreground">
							<Link href="/">
								<HousePlug className="size-4" />
								Home
							</Link>
						</Button>
					</div>

					{/* Helpful Alternative Destinations Grid */}
					<div className="w-full max-w-2xl pt-10 border-t border-border/60">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
							What would you like to do next?
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
							<Link
								href="/explore"
								className="group p-4 rounded-lg border bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-200 shadow-xs flex flex-col justify-between"
							>
								<div className="space-y-1.5">
									<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
										<Search className="size-4" />
									</div>
									<h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
										Browse Catalog
									</h3>
									<p className="text-xs text-muted-foreground line-clamp-2">
										Search by category, tags, or upvote counts.
									</p>
								</div>
							</Link>

							<Link
								href="/submit"
								className="group p-4 rounded-lg border bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-200 shadow-xs flex flex-col justify-between"
							>
								<div className="space-y-1.5">
									<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
										<Sparkles className="size-4" />
									</div>
									<h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
										Launch Yours
									</h3>
									<p className="text-xs text-muted-foreground line-clamp-2">
										Showcase your SaaS, AI tool, or side project.
									</p>
								</div>
							</Link>

							<Link
								href="/contact"
								className="group p-4 rounded-lg border bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-200 shadow-xs flex flex-col justify-between"
							>
								<div className="space-y-1.5">
									<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
										<Compass className="size-4" />
									</div>
									<h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
										Need Help?
									</h3>
									<p className="text-xs text-muted-foreground line-clamp-2">
										Reach out if a product link should exist.
									</p>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

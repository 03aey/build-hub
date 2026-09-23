import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Compass,
	HousePlug,
	Search,
	SparklesIcon,
	Terminal
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-[92vh] flex flex-col justify-center items-center py-16 px-4">
			<div className="w-full max-w-2xl mx-auto text-center space-y-8">
				{/* Top Status Pill */}
				<div className="inline-flex items-center">
					<Badge
						variant="outline"
						className="px-3 py-1 rounded-full text-xs font-semibold gap-1.5 border-primary/30 bg-primary/10 text-primary"
					>
						<Compass className="size-3.5" />
						404 • Page Not Found
					</Badge>
				</div>

				{/* Big 404 Number & Heading */}
				<div className="space-y-3">
					<h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight bg-linear-to-b from-foreground via-foreground/80 to-muted-foreground/30 bg-clip-text text-transparent">
						404
					</h1>
					<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Lost in the Builder Space?
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
						The page you&apos;re looking for doesn&apos;t exist, was moved, or
						the link might be broken. Let&apos;s get you back to discovering great projects.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
					<Button asChild size="lg" className="rounded-full gap-2 px-6">
						<Link href="/explore">
							<Terminal className="size-4" />
							Explore Products
						</Link>
					</Button>

					<Button asChild variant="outline" size="lg" className="rounded-full gap-2 px-6">
						<Link href="/">
							<HousePlug className="size-4" />
							Back to Home
						</Link>
					</Button>
				</div>

				{/* Quick Links Card */}
				<div className="pt-8 border-t border-border/60 max-w-lg mx-auto">
					<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
						Popular Destinations
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
						<Link
							href="/explore"
							className="p-2.5 rounded-lg border bg-card/60 hover:bg-card hover:border-primary/40 transition-colors flex items-center justify-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
						>
							<Search className="size-3.5 text-primary" />
							<span>Discover</span>
						</Link>
						<Link
							href="/submit"
							className="p-2.5 rounded-lg border bg-card/60 hover:bg-card hover:border-primary/40 transition-colors flex items-center justify-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
						>
							<SparklesIcon className="size-3.5 text-primary" />
							<span>Submit App</span>
						</Link>
						<Link
							href="/contact"
							className="p-2.5 rounded-lg border bg-card/60 hover:bg-card hover:border-primary/40 transition-colors flex items-center justify-center gap-1.5 font-medium text-muted-foreground hover:text-foreground col-span-2 sm:col-span-1"
						>
							<Compass className="size-3.5 text-primary" />
							<span>Help & FAQ</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

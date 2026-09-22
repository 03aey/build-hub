import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_STATS } from "@/lib/data/site-data";
import { Forward, Shredder } from "lucide-react";
import Link from "next/link";
import StatsCard from "./stats-card";

const LiveBadge = () => {
	return (
		<Badge
			variant="outline"
			className="px-4 py-2 mb-8 text-sm backdrop-blur-sm"
		>
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
				<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
			</span>
			<span className="text-muted-foreground">
				Join thousands of creators sharing their work
			</span>
		</Badge>
	);
};

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-linear-to-b from-background via-background to-muted/20">
			<div className="wrapper">
				<div className="flex flex-col items-center justify-center lg:py-24 py-12 text-center">
					<LiveBadge />
					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl">
						Share What You&apos;ve{" "}
						<span className="bg-linear-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
							Built
						</span>
						,<br />
						Discover What&apos;s{" "}
						<span className="bg-linear-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
							Launching
						</span>
					</h1>
					<p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
						A platform for creators to showcase their work, get
						authentic feedback, and build together. No fake
						launches, no fake builders. Just real people, building
						real things.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 mb-16">
						<Button
							asChild
							size="lg"
							className="text-base px-8 shadow-lg"
						>
							<Link href="/submit">
								<Shredder className="size-5" />
								Share Your Project
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							className="text-base px-8 shadow-lg"
							variant="secondary"
						>
							<Link href="/explore">
								Explore Projects <Forward className="size-5" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-2xl w-full">
						{HERO_STATS.map((stat) => (
							<StatsCard key={stat.label} {...stat} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

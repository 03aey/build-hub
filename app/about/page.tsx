import SectionHeader from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ABOUT_HOW_IT_WORKS,
	ABOUT_PRINCIPLES,
	ABOUT_STATS,
	ABOUT_TECH_STACK,
} from "@/lib/data/site-data";
import { CheckCircle2, Sparkles, Terminal, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About Us - BuildHub",
	description:
		"Learn about BuildHub's mission to connect creators, showcase authentic projects, and foster a real community for makers.",
};

export default function AboutPage() {
	return (
		<div className="py-20 pt-10">
			<div className="wrapper space-y-8">
				{/* Hero Section */}
				<div className="space-y-6 flex flex-col items-center justify-center text-center">
					<div className="inline-flex items-center">
						<Badge
							variant="outline"
							className="px-3.5 py-1.5 rounded-full text-xs font-semibold gap-1.5 border-primary/30 bg-primary/10 text-primary"
						>
							<Sparkles className="size-3.5" />
							Built for Genuine Creators & Indie Builders
						</Badge>
					</div>

					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl">
						The Launchpad for{" "}
						<span className="bg-linear-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
							Real Software
						</span>{" "}
						and Authentic Builders.
					</h1>

					<p className="text-lg sm:text-xl text-muted-foreground max-w-4xl leading-relaxed">
						We started BuildHub because product discovery was
						broken. No bot upvotes, no pay-to-win hype, and no
						vanity metrics. Just real creators showcasing live
						tools, collecting actionable feedback, and building
						sustainable software together.
					</p>

					{/* Live Platform Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 w-full">
						{ABOUT_STATS.map((stat) => (
							<div
								key={stat.label}
								className="p-4 rounded-lg border bg-card/60 text-center space-y-1"
							>
								<p
									className={`text-3xl font-extrabold ${
										stat.highlight === "primary"
											? "text-primary"
											: stat.highlight === "chart-1"
												? "text-chart-1"
												: "text-foreground"
									}`}
								>
									{stat.value}
								</p>
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Our Story & Origin */}
				<section className="space-y-4">
					<div className="border rounded-lg p-4 bg-card/70 relative overflow-hidden">
						<div className="flex items-center gap-3 mb-4">
							<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
								The BuildHub Story
							</h2>
						</div>

						<div className="space-y-2 text-muted-foreground leading-relaxed text-base">
							<p>
								As indie hackers and developers, we spent months
								building tools only to watch traditional launch
								platforms get overrun by marketing bots,
								syndicated upvote rings, and ephemeral launches
								that disappeared after 24 hours.
							</p>
							<p>
								Software doesn&apos;t end on launch day—it
								begins there. Builders need a home to publish
								changelogs, receive genuine bug reports with
								reproductions, collect constructive star
								ratings, and engage in nested technical
								conversations with early adopters.
							</p>
							<p className="font-medium text-foreground">
								BuildHub is crafted to be that long-term
								launchpad: a community where good work speaks
								for itself, and where builders help each other
								ship better software.
							</p>
						</div>
					</div>
				</section>

				{/* Core Values / Pillars */}
				<section className="space-y-4">
					<SectionHeader
						title="Our Core Principles"
						description="The standards and philosophies that govern the BuildHub ecosystem"
					/>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{ABOUT_PRINCIPLES.map((principle) => {
							const Icon = principle.icon;
							return (
								<Card
									key={principle.title}
									className="rounded-lg border-border/60 hover:border-primary/40 transition-colors bg-card/50"
								>
									<CardHeader>
										<div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
											<Icon className="size-5" />
										</div>
										<CardTitle className="text-xl">
											{principle.title}
										</CardTitle>
										<CardDescription className="text-sm leading-relaxed">
											{principle.description}
										</CardDescription>
									</CardHeader>
								</Card>
							);
						})}
					</div>
				</section>

				{/* How BuildHub Works */}
				<section className="space-y-4">
					<SectionHeader
						title="How It Works"
						description="From your first commit to scaling your active user base"
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{ABOUT_HOW_IT_WORKS.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.step}
									className="p-5 rounded-lg border bg-card/40 space-y-3"
								>
									<div className="flex items-center justify-between">
										<span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
											{step.step}
										</span>
										<Icon className="size-4 text-muted-foreground" />
									</div>
									<h3 className="font-bold text-base">
										{step.title}
									</h3>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{step.description}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* Built with Modern Tech Stack */}
				<section className="space-y-4">
					<SectionHeader
						title="Engineered for Performance"
						description="Modern, blazing-fast infrastructure built on the latest web technologies"
					/>

					<div className="border rounded-lg p-6 bg-card/40 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{ABOUT_TECH_STACK.map((tech) => (
								<div key={tech.title} className="space-y-2">
									<h4 className="font-semibold text-sm flex items-center gap-2">
										<CheckCircle2 className="size-4 text-primary" />
										{tech.title}
									</h4>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{tech.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="pt-2">
					<div className="border border-primary/20 rounded-lg p-8 sm:p-12 bg-linear-to-b from-primary/10 via-card/80 to-card space-y-6 flex flex-col items-center justify-center text-center">
						<div className="size-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
							<Users className="size-6" />
						</div>

						<div className="space-y-2 max-w-2xl">
							<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
								Ready to share what you&apos;ve built?
							</h2>
							<p className="text-muted-foreground text-sm sm:text-base">
								Join hundreds of developers showcasing real
								software and getting genuine feedback today.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-3.5 pt-2">
							<Button
								asChild
								size="lg"
								className="rounded-full px-8"
							>
								<Link href="/submit">
									<Sparkles className="size-4 mr-1.5" />
									Submit Your Project
								</Link>
							</Button>

							<Button
								asChild
								variant="outline"
								size="lg"
								className="rounded-full px-8"
							>
								<Link href="/explore">
									<Terminal className="size-4 mr-1.5" />
									Explore Directory
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

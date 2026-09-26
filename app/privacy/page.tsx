import SectionHeader from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIVACY_TLDR_CARDS } from "@/lib/data/site-data";
import {
	CheckCircle2,
	Database,
	Globe,
	KeyRound,
	MessageSquareLock,
	ShieldCheck,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy - BuildHub",
	description:
		"BuildHub's comprehensive privacy policy explaining how we collect, handle, and protect your data with total transparency.",
};

export default function PrivacyPage() {
	return (
		<div className="pb-20 pt-4">
			<div className="wrapper space-y-6">
				{/* Top Header */}
				<div className="space-y-4">
					<div className="inline-flex items-center">
						<Badge
							variant="outline"
							className="px-3.5 py-1.5 rounded-full text-xs font-semibold gap-1.5 border-primary/30 bg-primary/10 text-primary"
						>
							<ShieldCheck className="size-3.5" />
							Data Privacy & Transparency • Last Updated: March
							2026
						</Badge>
					</div>

					<SectionHeader
						title="Privacy Policy"
						icon={MessageSquareLock}
						description="We believe in radical transparency and data minimalism. Here is an honest breakdown of what information we collect, how it powers your builder experience, and how we keep it safe."
					/>
				</div>

				{/* Quick TL;DR Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{PRIVACY_TLDR_CARDS.map((card) => {
						const Icon = card.icon;
						return (
							<Card
								key={card.title}
								className="rounded-lg border-border/60 bg-card/60"
							>
								<CardHeader className="pb-2">
									<div
										className={`size-9 rounded-lg flex items-center justify-center mb-1 ${card.iconColor}`}
									>
										<Icon className="size-4.5" />
									</div>
									<CardTitle className="text-base">
										{card.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{card.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Detailed Policy Sections */}
				<div className="space-y-6 text-foreground/90">
					{/* 1. Information We Collect */}
					<Card className="rounded-lg border-border/70 bg-card/40">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <Database className="size-5 text-primary" /> */}
								1. Information We Collect
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								We only collect information strictly necessary
								to provide BuildHub&apos;s product discovery and
								community discussion features:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
								<div className="p-4 rounded-lg border bg-background/50 space-y-1.5">
									<h4 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
										<CheckCircle2 className="size-3.5 text-primary" />
										Account & Auth Data
									</h4>
									<p className="text-xs">
										When you log in via Clerk, we receive
										your primary email address, public
										profile name, and avatar image to
										authenticate your maker identity.
									</p>
								</div>

								<div className="p-4 rounded-lg border bg-background/50 space-y-1.5">
									<h4 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
										<CheckCircle2 className="size-3.5 text-primary" />
										Product Submissions
									</h4>
									<p className="text-xs">
										Product name, tagline, description,
										website URL, and tags you provide when
										listing a project on BuildHub.
									</p>
								</div>

								<div className="p-4 rounded-lg border bg-background/50 space-y-1.5">
									<h4 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
										<CheckCircle2 className="size-3.5 text-primary" />
										Community Contributions
									</h4>
									<p className="text-xs">
										Discussions, bug reports, feature
										suggestions, maker changelogs, upvotes,
										and star rating reviews you author.
									</p>
								</div>

								<div className="p-4 rounded-lg border bg-background/50 space-y-1.5">
									<h4 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
										<CheckCircle2 className="size-3.5 text-primary" />
										Technical Telemetry
									</h4>
									<p className="text-xs">
										IP address, browser type, and basic
										request headers collected solely for
										security rate limiting and preventing
										fraudulent upvoting bots.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 2. How We Use Information */}
					<Card className="rounded-lg border-border/70 bg-card/40">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <Eye className="size-5 text-primary" /> */}
								2. How We Use Your Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								We process your data for the following
								legitimate purposes:
							</p>
							<ul className="space-y-1 list-disc pl-5">
								<li>
									<strong className="text-foreground">
										Product Presentation:
									</strong>{" "}
									Displaying your submitted products, tags,
									and maker profile across the BuildHub
									directory.
								</li>
								<li>
									<strong className="text-foreground">
										Authentic Feedback System:
									</strong>{" "}
									Enabling nested comments, bug report
									tracking, and review score aggregation.
								</li>
								<li>
									<strong className="text-foreground">
										Vote Verification:
									</strong>{" "}
									Preventing automated bot manipulation and
									ensuring fair community ranking.
								</li>
								<li>
									<strong className="text-foreground">
										Service Communications:
									</strong>{" "}
									Sending essential administrative emails
									regarding product approvals, security
									notices, or support inquiries.
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* 3. Third-Party Service Providers */}
					<Card className="rounded-lg border-border/70 bg-card/40">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <Server className="size-5 text-primary" /> */}
								3. Infrastructure & Subprocessors
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								BuildHub partners with trusted cloud
								infrastructure providers that adhere to rigorous
								security and compliance standards:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
								<div className="p-3.5 rounded-lg border bg-background/50 space-y-1">
									<div className="flex items-center gap-2 font-semibold text-foreground text-sm">
										<KeyRound className="size-4 text-primary" />
										Clerk Inc.
									</div>
									<p className="text-xs">
										Handles secure authentication, session
										management, and OAuth integrations.
									</p>
								</div>

								<div className="p-3.5 rounded-lg border bg-background/50 space-y-1">
									<div className="flex items-center gap-2 font-semibold text-foreground text-sm">
										<Database className="size-4 text-primary" />
										Neon Database
									</div>
									<p className="text-xs">
										Provides encrypted serverless PostgreSQL
										cloud storage with automated backups.
									</p>
								</div>

								<div className="p-3.5 rounded-lg border bg-background/50 space-y-1">
									<div className="flex items-center gap-2 font-semibold text-foreground text-sm">
										<Globe className="size-4 text-primary" />
										Vercel
									</div>
									<p className="text-xs">
										Global Edge CDN hosting and SSL/TLS
										certificate termination.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 4. Data Security & Storage */}
					<Card className="rounded-lg border-border/70 bg-card/40">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <Lock className="size-5 text-primary" /> */}
								4. Data Protection & Security Controls
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								We implement technical and organizational
								measures to safeguard your personal data,
								including:
							</p>
							<ul className="space-y-1 list-disc pl-5">
								<li>
									End-to-end encryption in transit via modern
									TLS 1.3 cryptographic protocols.
								</li>
								<li>
									Encrypted database storage at rest with
									strict least-privilege administrative
									access.
								</li>
								<li>
									Continuous vulnerability scans and
									dependency patch management.
								</li>
								<li>
									Zero storage of sensitive payment
									credentials or plaintext passwords.
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* 5. User Rights (GDPR & CCPA) */}
					<Card className="rounded-lg border-border/70 bg-card/40">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <ShieldAlert className="size-5 text-primary" /> */}
								5. Your Rights & Data Choices
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								Regardless of your location, BuildHub affords
								all users full control over their personal
								information:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
								<div className="p-3 rounded-lg border bg-background/50">
									<strong className="text-foreground text-sm block mb-1">
										Right to Access & Export:
									</strong>
									<span className="text-xs">
										Request a machine-readable copy of your
										profile and submitted products.
									</span>
								</div>
								<div className="p-3 rounded-lg border bg-background/50">
									<strong className="text-foreground text-sm block mb-1">
										Right to Rectify:
									</strong>
									<span className="text-xs">
										Update your product details,
										descriptions, and tags at any time.
									</span>
								</div>
								<div className="p-3 rounded-lg border bg-background/50">
									<strong className="text-foreground text-sm block mb-1">
										Right to Erasure (Forget):
									</strong>
									<span className="text-xs">
										Request the permanent deletion of your
										account and all associated submissions.
									</span>
								</div>
								<div className="p-3 rounded-lg border bg-background/50">
									<strong className="text-foreground text-sm block mb-1">
										Right to Restrict Processing:
									</strong>
									<span className="text-xs">
										Unpublish or hide your product listings
										from public discovery indices.
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 6. Policy Updates & Contact */}
					<Card className="rounded-lg border-primary/20 bg-primary/5">
						<CardHeader>
							<CardTitle className="flex items-center gap-2.5 text-xl">
								{/* <Mail className="size-5 text-primary" /> */}
								6. Contacting BuildHub About Privacy
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
							<p>
								If you have questions, inquiries regarding this
								Privacy Policy, or wish to exercise your data
								protection rights, please contact our team:
							</p>
							<div className="flex flex-wrap items-center gap-4 pt-1">
								<div className="p-3 rounded-lg border bg-card/80 text-xs space-y-1 w-50">
									<span className="text-muted-foreground block">
										Email Support:
									</span>
									<span className="font-semibold text-foreground">
										yalok6321@gmail.com
									</span>
								</div>
								<div className="p-3 rounded-lg border bg-card/80 text-xs space-y-1 w-75">
									<span className="text-muted-foreground block">
										Interactive Help Desk:
									</span>
									<Link
										href="/contact"
										className="font-semibold text-primary hover:underline"
									>
										Submit a message on our Contact Page
										&rarr;
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

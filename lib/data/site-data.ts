import {
	CategoryOption,
	ChangelogCategoryConfig,
	ChangelogCategoryId,
	FooterSectionType,
	HeroStatType,
	NavItemType,
	SocialLinkType,
} from "@/types";
import {
	Bug,
	ChevronsUp,
	Code2,
	Flame,
	FolderGit2,
	Github,
	GitPullRequest,
	HandPlatter,
	HatGlasses,
	HeartHandshake,
	HelpCircle,
	HousePlug,
	Lightbulb,
	Linkedin,
	Lock,
	MessageSquare,
	MessagesSquare,
	Shield,
	Star,
	Telescope,
	Twitter,
	UserCheck,
	UsersIcon,
	Zap,
} from "lucide-react";

// ==========================================
// HERO & LANDING STATS
// ==========================================
export const HERO_STATS: HeroStatType[] = [
	{
		icon: FolderGit2,
		value: "1.4K+",
		label: "Projects Shared",
	},
	{
		icon: UsersIcon,
		value: "7K+",
		label: "Active Creators",
		hasBorder: true,
	},
	{
		icon: HatGlasses,
		value: "43K+",
		label: "Monthly Visitors",
	},
];

// ==========================================
// NAVIGATION ITEMS
// ==========================================
export const MAIN_NAV_ITEMS: NavItemType[] = [
	{
		label: "Home",
		href: "/",
		icon: HousePlug,
	},
	{
		label: "Explore",
		href: "/explore",
		icon: Telescope,
	},
	// {
	// 	label: "About",
	// 	href: "/about",
	// 	icon: Compass,
	// },
];

export const FOOTER_SECTIONS: FooterSectionType[] = [
	{
		title: "Product",
		links: [
			{ label: "Explore", href: "/explore" },
			{ label: "Trending", href: "/explore?sort=trending" },
			{ label: "Submit Project", href: "/submit" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Contact", href: "/contact" },
			{ label: "Privacy", href: "/privacy" },
		],
	},
];

export const SOCIAL_LINKS: SocialLinkType[] = [
	{
		label: "Twitter",
		href: "https://x.com/@03aeyx",
		icon: Twitter,
	},
	{
		label: "GitHub",
		href: "https://github.com/03aey",
		icon: Github,
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/03aey",
		icon: Linkedin,
	},
];

// ==========================================
// COMMUNITY CATEGORIES
// ==========================================
export const DISCUSSION_CATEGORIES: CategoryOption[] = [
	{ id: "all", label: "All Topics", icon: MessagesSquare },
	{
		id: "question",
		label: "Questions | Q&A",
		icon: HelpCircle,
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
	},
	{
		id: "feedback",
		label: "Feedback & Ideas",
		icon: Lightbulb,
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
	},
	{
		id: "bug",
		label: "Bug Reports",
		icon: Bug,
		color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
	},
	{
		id: "general",
		label: "General Chat",
		icon: MessageSquare,
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
	},
];

export const CHANGELOG_CATEGORIES: Record<
	ChangelogCategoryId,
	ChangelogCategoryConfig
> = {
	feature: {
		label: "New Feature",
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
		icon: HandPlatter,
	},
	improvement: {
		label: "Improvement",
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
		icon: ChevronsUp,
	},
	fix: {
		label: "Bug Fix",
		color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
		icon: Bug,
	},
	milestone: {
		label: "Milestone",
		color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
		icon: Flame,
	},
};

// ==========================================
// ABOUT PAGE DATA
// ==========================================
export const ABOUT_STATS = [
	{ value: "100%", label: "Authentic Submissions", highlight: "foreground" },
	{ value: "0%", label: "Bot Upvote Rings", highlight: "primary" },
	{ value: "Verified", label: "Maker Identities", highlight: "foreground" },
	{
		value: "Continuous",
		label: "Changelogs & Updates",
		highlight: "chart-1",
	},
];

export const ABOUT_PRINCIPLES = [
	{
		icon: Flame,
		title: "Genuine Discovery",
		description:
			"We prioritize craftsmanship and problem-solving over marketing budgets. Every product gets an honest shot at discovery based on real community interest.",
	},
	{
		icon: HeartHandshake,
		title: "Constructive Feedback",
		description:
			"From granular bug reports to thoughtful reviews, our feedback loops are designed to give makers actionable insights that directly improve their products.",
	},
	{
		icon: GitPullRequest,
		title: "Iterative Building",
		description:
			"We celebrate the entire product lifecycle. Post changelogs, share milestones, and keep your community engaged through version releases.",
	},
];

export const ABOUT_HOW_IT_WORKS = [
	{
		step: "Step 1",
		title: "Submit Your Product",
		description:
			"Add your project details, live URL, tags, and tagline in under two minutes.",
		icon: Code2,
	},
	{
		step: "Step 2",
		title: "Gather Discussions",
		description:
			"Engage with fellow builders via nested discussions, feature ideas, and QA chats.",
		icon: MessageSquare,
	},
	{
		step: "Step 3",
		title: "Collect Real Reviews",
		description:
			"Build social proof through authentic star ratings and verified maker responses.",
		icon: Star,
	},
	{
		step: "Step 4",
		title: "Ship Changelogs",
		description:
			"Publish version updates and major feature drops to keep early adopters informed.",
		icon: Zap,
	},
];

export const ABOUT_TECH_STACK = [
	{
		title: "Next.js 16 & Turbopack",
		description:
			"Utilizing Partial Prerendering (PPR) and Server Components for instant page transitions.",
	},
	{
		title: "PostgreSQL & Drizzle ORM",
		description:
			"Type-safe database queries with serverless Neon PostgreSQL for reliable high-speed data.",
	},
	{
		title: "Secure Clerk Authentication",
		description:
			"Seamless, secure sign-in with verified builder accounts and identity protection.",
	},
];

// ==========================================
// PRIVACY PAGE DATA
// ==========================================
export const PRIVACY_TLDR_CARDS = [
	{
		icon: Shield,
		iconColor: "text-emerald-500 bg-emerald-500/10",
		title: "We Never Sell Data",
		description:
			"Your personal information, emails, and browsing behaviors are never sold to data brokers or third-party advertisers.",
	},
	{
		icon: Lock,
		iconColor: "text-primary bg-primary/10",
		title: "Encrypted & Secure",
		description:
			"All data is transmitted via HTTPS/TLS and stored in encrypted PostgreSQL databases managed with enterprise-grade safeguards.",
	},
	{
		icon: UserCheck,
		iconColor: "text-blue-500 bg-blue-500/10",
		title: "You Own Your Data",
		description:
			"You retain complete ownership over your product submissions, comments, reviews, and can request data deletion at any time.",
	},
];

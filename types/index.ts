import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	bookmarks,
	comments,
	contactSubmissions,
	products,
	productReviews,
	productUpdates,
} from "@/db/schema";
import { LucideIcon } from "lucide-react";

// ==========================================
// FORM & ACTION STATES
// ==========================================
export type FormState = {
	success: boolean;
	errors?: Record<string, string[]>;
	message: string;
};

// ==========================================
// DATABASE SELECT MODELS
// ==========================================
export type ProductType = InferSelectModel<typeof products>;
export type CommentType = InferSelectModel<typeof comments>;
export type ProductUpdateType = InferSelectModel<typeof productUpdates>;
export type ProductReviewType = InferSelectModel<typeof productReviews>;
export type ContactSubmissionType = InferSelectModel<typeof contactSubmissions>;
export type BookmarkType = InferSelectModel<typeof bookmarks>;

// ==========================================
// DATABASE INSERT MODELS
// ==========================================
export type NewProductType = InferInsertModel<typeof products>;
export type NewCommentType = InferInsertModel<typeof comments>;
export type NewProductUpdateType = InferInsertModel<typeof productUpdates>;
export type NewProductReviewType = InferInsertModel<typeof productReviews>;
export type NewContactSubmissionType = InferInsertModel<typeof contactSubmissions>;
export type NewBookmarkType = InferInsertModel<typeof bookmarks>;

export const DEFAULT_BOOKMARK_LISTS = [
	"Want to Test",
	"DevTools & Frameworks",
	"AI & Machine Learning",
	"Design & UI Inspiration",
	"Favorites",
] as const;

// ==========================================
// BOOKMARK & PERSONAL LIST TYPES
// ==========================================
export type BookmarkWithProductType = BookmarkType & {
	product: ProductType;
};

export type BookmarkListSummaryType = {
	name: string;
	count: number;
};

// ==========================================
// COMMUNITY & DISCUSSION TYPES
// ==========================================
export type NestedCommentType = CommentType & {
	replies?: NestedCommentType[];
};

export type ReviewStatsType = {
	averageRating: number;
	totalReviews: number;
	averageUxRating: number;
	averagePricingRating: number;
	ratingDistribution: Record<number, number>;
};

export type DiscussionCategoryId =
	| "all"
	| "question"
	| "feedback"
	| "bug"
	| "general";

export type ChangelogCategoryId =
	| "feature"
	| "milestone"
	| "improvement"
	| "fix";

export type CategoryOption = {
	id: DiscussionCategoryId;
	label: string;
	icon: LucideIcon;
	color?: string;
};

export type ChangelogCategoryConfig = {
	label: string;
	color: string;
	icon: LucideIcon;
};

// ==========================================
// NAVIGATION & STATS TYPES
// ==========================================
export type NavItemType = {
	label: string;
	href: string;
	icon?: LucideIcon;
};

export type FooterSectionType = {
	title: string;
	links: { label: string; href: string; external?: boolean }[];
};

export type SocialLinkType = {
	label: string;
	href: string;
	icon: LucideIcon;
};

export type HeroStatType = {
	icon: LucideIcon;
	value: string;
	label: string;
	hasBorder?: boolean;
};

export type AdminStatType = {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
	trend?: string;
};

export type ProductSortType = "trending" | "recent" | "top" | "all";

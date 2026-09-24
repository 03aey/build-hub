import {
	pgTable,
	serial,
	text,
	varchar,
	integer,
	timestamp,
	json,
	uniqueIndex,
	index,
} from "drizzle-orm/pg-core";

// ---------------- PRODUCTS ----------------
export const products = pgTable(
	"products",
	{
		id: serial("id").primaryKey(),

		name: varchar("name", { length: 120 }).notNull(),
		slug: varchar("slug", { length: 140 }).notNull(),
		tagline: varchar("tagline", { length: 200 }),
		description: text("description"),

		websiteUrl: text("website_url"),
		tags: json("tags").$type<string[]>(),

		voteCount: integer("vote_count").notNull().default(0),
		votedBy: json("voted_by").$type<string[]>().default([]),

		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		approvedAt: timestamp("approved_at", { withTimezone: true }),
		status: varchar("status", { length: 20 }).default("pending"),
		submittedBy: varchar("submitted_by", { length: 120 }).default(
			"anonymous",
		),
		userId: varchar("user_id", { length: 255 }),

		organizationId: varchar("organization_id", { length: 255 }),
	},
	(table) => ({
		slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
		statusIdx: index("products_status_idx").on(table.status),
		organizationIdx: index("products_organization_idx").on(
			table.organizationId,
		),
	}),
);

// ---------------- CONTACT SUBMISSIONS ----------------
export const contactSubmissions = pgTable(
	"contact_submissions",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		subject: varchar("subject", { length: 255 }).notNull(),
		description: text("description").notNull(),
		reason: varchar("reason", { length: 100 }).notNull(),
		status: varchar("status", { length: 20 }).default("pending"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		userId: varchar("user_id", { length: 255 }),
	},
	(table) => ({
		statusIdx: index("contact_submissions_status_idx").on(table.status),
		emailIdx: index("contact_submissions_email_idx").on(table.email),
	}),
);

// ---------------- COMMENTS / DISCUSSIONS & Q&A ----------------
export const comments = pgTable(
	"comments",
	{
		id: serial("id").primaryKey(),
		productId: integer("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		userId: varchar("user_id", { length: 255 }).notNull(),
		userName: varchar("user_name", { length: 255 }).notNull().default("Community Member"),
		userAvatar: text("user_avatar"),
		userRole: varchar("user_role", { length: 50 }).default("user"), // 'maker' | 'user' | 'admin'
		parentId: integer("parent_id"), // self-referential for nested replies
		content: text("content").notNull(),
		category: varchar("category", { length: 50 }).default("general"), // 'general' | 'question' | 'feedback' | 'bug'
		upvotes: integer("upvotes").notNull().default(0),
		upvotedBy: json("upvoted_by").$type<string[]>().default([]),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		productIdIdx: index("comments_product_id_idx").on(table.productId),
		parentIdIdx: index("comments_parent_id_idx").on(table.parentId),
		createdAtIdx: index("comments_created_at_idx").on(table.createdAt),
	}),
);

// ---------------- MAKER CHANGELOG / MILESTONES ----------------
export const productUpdates = pgTable(
	"product_updates",
	{
		id: serial("id").primaryKey(),
		productId: integer("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		userId: varchar("user_id", { length: 255 }).notNull(),
		version: varchar("version", { length: 50 }),
		title: varchar("title", { length: 255 }).notNull(),
		content: text("content").notNull(),
		category: varchar("category", { length: 50 }).default("feature"), // 'feature' | 'milestone' | 'improvement' | 'fix'
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		productIdIdx: index("product_updates_product_id_idx").on(table.productId),
		createdAtIdx: index("product_updates_created_at_idx").on(table.createdAt),
	}),
);

// ---------------- STRUCTURED REVIEWS & RATINGS ----------------
export const productReviews = pgTable(
	"product_reviews",
	{
		id: serial("id").primaryKey(),
		productId: integer("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		userId: varchar("user_id", { length: 255 }).notNull(),
		userName: varchar("user_name", { length: 255 }).notNull(),
		userAvatar: text("user_avatar"),
		rating: integer("rating").notNull().default(5), // 1 - 5
		uxRating: integer("ux_rating").default(5), // 1 - 5
		pricingRating: integer("pricing_rating").default(5), // 1 - 5
		title: varchar("title", { length: 255 }).notNull(),
		pros: text("pros"),
		cons: text("cons"),
		content: text("content").notNull(),
		isVerifiedUser: varchar("is_verified_user", { length: 10 }).default("false"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		productIdIdx: index("product_reviews_product_id_idx").on(table.productId),
		userProductIdx: index("product_reviews_user_product_idx").on(
			table.userId,
			table.productId,
		),
	}),
);

// ---------------- BOOKMARKS & PERSONAL LISTS ----------------
export const bookmarks = pgTable(
	"bookmarks",
	{
		id: serial("id").primaryKey(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		productId: integer("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		listName: varchar("list_name", { length: 100 }).notNull().default("Want to Test"),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		userProductIdx: uniqueIndex("bookmarks_user_product_idx").on(
			table.userId,
			table.productId,
		),
		userIdIdx: index("bookmarks_user_id_idx").on(table.userId),
	}),
);


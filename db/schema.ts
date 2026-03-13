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

// ---------------- VOTES ----------------
export const votes = pgTable(
	"votes",
	{
		id: serial("id").primaryKey(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		productId: integer("product_id")
			.notNull()
			.references(() => products.id),

		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		// 🚀 prevents duplicate voting
		userProductIdx: uniqueIndex("votes_user_product_idx").on(
			table.userId,
			table.productId,
		),
		userIdx: index("votes_user_idx").on(table.userId),
		productIdx: index("votes_product_idx").on(table.productId),
	}),
);

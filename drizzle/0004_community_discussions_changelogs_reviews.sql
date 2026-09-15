CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"user_name" varchar(255) DEFAULT 'Community Member' NOT NULL,
	"user_avatar" text,
	"user_role" varchar(50) DEFAULT 'user',
	"parent_id" integer,
	"content" text NOT NULL,
	"category" varchar(50) DEFAULT 'general',
	"upvotes" integer DEFAULT 0 NOT NULL,
	"upvoted_by" json DEFAULT '[]'::json,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"version" varchar(50),
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) DEFAULT 'feature',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_avatar" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"ux_rating" integer DEFAULT 5,
	"pricing_rating" integer DEFAULT 5,
	"title" varchar(255) NOT NULL,
	"pros" text,
	"cons" text,
	"content" text NOT NULL,
	"is_verified_user" varchar(10) DEFAULT 'false',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "product_updates" ADD CONSTRAINT "product_updates_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "comments_product_id_idx" ON "comments" USING btree ("product_id");
--> statement-breakpoint
CREATE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "product_updates_product_id_idx" ON "product_updates" USING btree ("product_id");
--> statement-breakpoint
CREATE INDEX "product_updates_created_at_idx" ON "product_updates" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "product_reviews_product_id_idx" ON "product_reviews" USING btree ("product_id");
--> statement-breakpoint
CREATE INDEX "product_reviews_user_product_idx" ON "product_reviews" USING btree ("user_id","product_id");

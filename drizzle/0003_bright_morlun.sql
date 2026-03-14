DROP TABLE "votes" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "voted_by" json DEFAULT '[]'::json;
import { z } from "zod";

export const productSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(120, { message: "Name must be less than 120 characters" }),
	slug: z
		.string()
		.trim()
		.min(3, { message: "Slug must be at least 3 characters" })
		.max(140, { message: "Slug must be less than 140 characters" })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"Slug must be lowercase alphanumeric and can include hyphens (e.g., my-awesome-app)",
		}),
	tagline: z
		.string()
		.trim()
		.min(5, { message: "Tagline must be at least 5 characters" })
		.max(200, { message: "Tagline must be less than 200 characters" }),
	description: z
		.string()
		.trim()
		.min(10, { message: "Description must be at least 10 characters" })
		.optional()
		.or(z.literal("")),
	websiteUrl: z
		.string()
		.trim()
		.min(1, { message: "Website URL is required" })
		.url({ message: "Please enter a valid website URL (e.g., https://example.com)" }),
	tags: z
		.string()
		.trim()
		.min(1, { message: "At least one tag is required" })
		.transform((val) =>
			val
				.split(",")
				.map((tag) => tag.trim().toLowerCase())
				.filter(Boolean),
		),
});

"use client";

import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addProductAction } from "@/lib/products/product-actions";
import { FormState } from "@/types";
import {
	AlertCircle,
	CircleCheckBig,
	Loader2Icon,
	PlusCircle,
	SendHorizonal,
} from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const initialState: FormState = {
	success: false,
	errors: undefined,
	message: "",
};

export default function ProductSubmitForm() {
	const [state, formAction, isPending] = useActionState(
		addProductAction,
		initialState,
	);

	const { errors, message, success } = state;

	const getFieldErrors = (fieldName: string): string[] => {
		if (!errors) return [];
		return (errors as Record<string, string[]>)[fieldName] ?? [];
	};

	if (success) {
		return (
			<Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5 shadow-none">
				<CardContent className="pt-6">
					<div className="text-center py-8 space-y-4">
						<CircleCheckBig className="size-8 md:size-10 text-muted-foreground/90 mx-auto" />
						<div className="space-y-2">
							<h3 className="text-2xl font-bold">
								Product Submitted Successfully!
							</h3>
							<p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
								{message ||
									"Your project has been submitted and is currently pending review. Once approved, it will be listed in the community explorer."}
							</p>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
							<Button asChild variant="outline">
								<Link href="/explore">Explore Products</Link>
							</Button>
							<Button
								onClick={() => window.location.reload()}
								className="gap-2"
							>
								<PlusCircle className="size-4" />
								Submit Another Product
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<form className="space-y-6" action={formAction}>
			{message && !success && (
				<div
					className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3"
					role="alert"
					aria-live="polite"
				>
					<AlertCircle className="size-5 shrink-0 mt-0.5" />
					<div className="space-y-1 text-sm">
						<p className="font-semibold">Submission Error</p>
						<p className="text-xs opacity-90">{message}</p>
					</div>
				</div>
			)}

			<FormField
				label="Product Name"
				name="name"
				id="name"
				placeholder="e.g. Acme Studio"
				required
				error={getFieldErrors("name")}
			/>

			<FormField
				label="Slug"
				name="slug"
				id="slug"
				placeholder="e.g. acme-studio"
				required
				helperText="URL-friendly identifier for your product (lowercase letters, numbers, and hyphens)"
				error={getFieldErrors("slug")}
			/>

			<FormField
				label="Tagline"
				name="tagline"
				id="tagline"
				placeholder="A concise, punchy description of what your product does"
				required
				error={getFieldErrors("tagline")}
			/>

			<FormField
				label="Description"
				name="description"
				id="description"
				placeholder="Tell the community about your journey, features, and target audience..."
				required
				error={getFieldErrors("description")}
				textarea
			/>

			<FormField
				label="Website URL"
				name="websiteUrl"
				id="websiteUrl"
				placeholder="https://yourproduct.com"
				required
				error={getFieldErrors("websiteUrl")}
				helperText="Live landing page, demo, or repository link"
			/>

			<FormField
				label="Tags"
				name="tags"
				id="tags"
				placeholder="Next.js, Tailwind CSS, AI, Open Source"
				required
				error={getFieldErrors("tags")}
				helperText="Comma-separated tags to help people discover your product"
			/>

			<Button
				type="submit"
				size="lg"
				className="w-full font-semibold"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2Icon className="size-4 animate-spin mr-1.5" />
						Submitting Product...
					</>
				) : (
					<>
						<SendHorizonal className="size-4 mr-1.5" />
						Submit Product for Review
					</>
				)}
			</Button>
		</form>
	);
}

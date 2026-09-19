"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	addReviewAction,
	deleteReviewAction,
} from "@/lib/community/community-actions";
import { ProductReviewType, ReviewStatsType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import {
	CheckCircle2,
	DollarSign,
	Layout,
	Loader2,
	PenSquare,
	Star,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	User
} from "lucide-react";
import { useActionState, useState } from "react";
import EmptyState from "../common/empty-state";
import StarRating from "./star-rating";

interface ReviewsSectionProps {
	productId: number;
	reviews: ProductReviewType[];
	stats: ReviewStatsType;
	productName: string;
}

export default function ReviewsSection({
	productId,
	reviews,
	stats,
	productName,
}: ReviewsSectionProps) {
	const { isSignedIn, userId } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	// Find if user already wrote a review
	const existingReview = reviews.find((r) => r.userId === userId);

	return (
		<div className="space-y-8">
			{/* Top Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						{/* <Star className="size-5 fill-amber-400 text-amber-400" /> */}
						<h3 className="text-xl font-bold">Community Reviews & Ratings</h3>
						{/* <Badge variant="secondary" className="font-mono text-xs">
							{stats.totalReviews}
						</Badge> */}
					</div>
					<p className="text-xs text-muted-foreground">
						Authentic, structured evaluations from real builders and testers.
					</p>
				</div>

				{isSignedIn ? (
					<ReviewModal
						productId={productId}
						productName={productName}
						existingReview={existingReview}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					/>
				) : (
					<Badge variant="outline" className="text-xs py-1.5 px-3">
						Sign in to write a review
					</Badge>
				)}
			</div>

			{/* Review Summary Scorecards */}
			{stats.totalReviews > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg border bg-card/60 shadow-xs">
					{/* Overall Rating Box */}
					<div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r space-y-2">
						<span className="text-5xl font-black text-foreground tracking-tight">
							{stats.averageRating.toFixed(1)}
						</span>
						<StarRating value={stats.averageRating} size="md" readOnly />
						<p className="text-xs font-medium text-muted-foreground">
							Based on {stats.totalReviews}{" "}
							{stats.totalReviews === 1 ? "review" : "reviews"}
						</p>
					</div>

					{/* Dimensional Breakdown (UX & Pricing) */}
					<div className="space-y-4 py-2 border-b md:border-b-0 md:border-r md:px-4">
						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="font-semibold flex items-center gap-1.5">
									<Layout className="size-3.5 text-primary" />
									UX & Design
								</span>
								<span className="font-bold">
									{stats.averageUxRating.toFixed(1)} / 5
								</span>
							</div>
							<div className="w-full h-2 rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-primary rounded-full transition-all duration-500"
									style={{
										width: `${(stats.averageUxRating / 5) * 100}%`,
									}}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="font-semibold flex items-center gap-1.5">
									<DollarSign className="size-3.5 text-emerald-500" />
									Value & Pricing
								</span>
								<span className="font-bold">
									{stats.averagePricingRating.toFixed(1)} / 5
								</span>
							</div>
							<div className="w-full h-2 rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-emerald-500 rounded-full transition-all duration-500"
									style={{
										width: `${(stats.averagePricingRating / 5) * 100}%`,
									}}
								/>
							</div>
						</div>
					</div>

					{/* Rating Distribution Histogram */}
					<div className="space-y-1.5 py-1">
						{[5, 4, 3, 2, 1].map((stars) => {
							const count = stats.ratingDistribution[stars] || 0;
							const percentage =
								stats.totalReviews > 0
									? (count / stats.totalReviews) * 100
									: 0;
							return (
								<div
									key={stars}
									className="flex items-center gap-2 text-xs text-muted-foreground"
								>
									<span className="w-3 font-medium text-right">
										{stars}
									</span>
									<Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
									<div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-amber-400 rounded-full"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<span className="w-6 text-right font-mono text-[11px]">
										{count}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Reviews List */}
			{reviews.length === 0 ? (
				<EmptyState
					header="No reviews yet"
					message={
						`Have you used or tested ${productName}? Be the first to share your structured feedback and rating!`
					}
					button={
						isSignedIn && (
							<Button
								onClick={() => setIsOpen(true)}
								size="sm"
								className="gap-2 mt-2"
							>
								<PenSquare className="size-4" />
								Write the First Review
							</Button>
						)}
				/>
			) : (
				<div className="space-y-4">
					{reviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							currentUserId={userId}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ---------------- Review Card ----------------
function ReviewCard({
	review,
	currentUserId,
}: {
	review: ProductReviewType;
	currentUserId?: string | null;
}) {
	const isAuthor = currentUserId === review.userId;
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete your review?")) return;
		setIsDeleting(true);
		await deleteReviewAction(review.id);
		setIsDeleting(false);
	};

	return (
		<div className="border rounded-lg p-4 bg-card/70 hover:bg-card transition-all shadow-xs space-y-4">
			<div className="flex items-start justify-between gap-3">
				{/* Reviewer Details */}
				<div className="flex items-center gap-3">
					<div className="size-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
						{review.userAvatar ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={review.userAvatar}
								alt={review.userName}
								className="size-full object-cover"
							/>
						) : (
							<User className="size-4 text-muted-foreground" />
						)}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm">
								{review.userName}
							</span>
							<Badge
								variant="secondary"
								className="text-[10px] py-0 px-1.5 gap-1 font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
							>
								<CheckCircle2 className="size-2.5" />
								Verified Tester
							</Badge>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span>
								{new Intl.DateTimeFormat("en-US", {
									month: "short",
									day: "2-digit",
									year: "numeric",
								}).format(
									new Date(review.createdAt?.toISOString() ?? ""),
								)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<StarRating value={review.rating} size="sm" showValue />
					{isAuthor && (
						<Button
							variant="ghost"
							size="icon"
							onClick={handleDelete}
							disabled={isDeleting}
							className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
						>
							<Trash2 className="size-3.5" />
						</Button>
					)}
				</div>
			</div>

			{/* Review Title & Content */}
			<div className="space-y-2">
				<h4 className="font-bold text-base text-foreground">
					{review.title}
				</h4>
				<p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
					{review.content}
				</p>
			</div>

			{/* Structured Pros & Cons */}
			{(review.pros || review.cons) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
					{review.pros && (
						<div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
							<div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
								<ThumbsUp className="size-3.5" />
								<span>What Works Great (Pros)</span>
							</div>
							<p className="text-foreground/85 leading-relaxed">
								{review.pros}
							</p>
						</div>
					)}
					{review.cons && (
						<div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
							<div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
								<ThumbsDown className="size-3.5" />
								<span>Room For Improvement (Cons)</span>
							</div>
							<p className="text-foreground/85 leading-relaxed">
								{review.cons}
							</p>
						</div>
					)}
				</div>
			)}

			{/* Sub-ratings */}
			<div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
				{review.uxRating && (
					<span className="flex items-center gap-1">
						<Layout className="size-3 text-primary" />
						UX: <strong className="text-foreground">{review.uxRating}/5</strong>
					</span>
				)}
				{review.pricingRating && (
					<span className="flex items-center gap-1">
						<DollarSign className="size-3 text-emerald-500" />
						Pricing:{" "}
						<strong className="text-foreground">
							{review.pricingRating}/5
						</strong>
					</span>
				)}
			</div>
		</div>
	);
}

// ---------------- Review Modal Form ----------------
function ReviewModal({
	productId,
	productName,
	existingReview,
	isOpen,
	setIsOpen,
}: {
	productId: number;
	productName: string;
	existingReview?: ProductReviewType;
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
}) {
	const [rating, setRating] = useState(existingReview?.rating ?? 5);
	const [uxRating, setUxRating] = useState(existingReview?.uxRating ?? 5);
	const [pricingRating, setPricingRating] = useState(
		existingReview?.pricingRating ?? 5,
	);
	const [state, formAction, isPending] = useActionState(addReviewAction, {
		success: false,
		message: "",
	});

	const handleSubmit = async (formData: FormData) => {
		formData.set("productId", productId.toString());
		formData.set("rating", rating.toString());
		formData.set("uxRating", uxRating.toString());
		formData.set("pricingRating", pricingRating.toString());
		formAction(formData);
		if (!state.errors) {
			setIsOpen(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2 shrink-0">
					<PenSquare className="size-4" />
					{existingReview ? "Edit Your Review" : "Write a Review"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{/* <Sparkles className="size-5 text-primary" /> */}
						{existingReview ? "Update Review for" : "Review & Rate"}{" "}
						{productName}
					</DialogTitle>
					<DialogDescription>
						Provide honest, structured feedback to help the maker improve and guide community members.
					</DialogDescription>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4 pt-2">
					{/* Interactive Rating Pickers */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border bg-muted/40">
						<div className="space-y-1 items-center flex flex-col">
							<Label className="text-xs font-semibold">Overall Rating *</Label>
							<div className="flex justify-center">
								<StarRating
									value={rating}
									onChange={setRating}
									readOnly={false}
									size="md"
								/>
							</div>
						</div>

						<div className="space-y-1 items-center flex flex-col">
							<Label className="text-xs font-semibold">UX & Design</Label>
							<div className="flex justify-center">
								<StarRating
									value={uxRating}
									onChange={setUxRating}
									readOnly={false}
									size="md"
								/>
							</div>
						</div>
						<div className="space-y-1 items-center flex flex-col">
							<Label className="text-xs font-semibold">Value / Pricing</Label>
							<div className="flex justify-center">
								<StarRating
									value={pricingRating}
									onChange={setPricingRating}
									readOnly={false}
									size="md"
								/>
							</div>
						</div>
					</div>

					{/* Title */}
					<div className="space-y-1.5">
						<Label htmlFor="title" className="text-xs font-semibold">
							Review Title / Summary *
						</Label>
						<Input
							id="title"
							name="title"
							defaultValue={existingReview?.title ?? ""}
							placeholder="e.g., Clean UI and fast workflow, highly recommended!"
							required
							className="text-sm"
						/>
						{state?.errors?.title && (
							<p className="text-xs text-destructive">
								{state.errors.title[0]}
							</p>
						)}
					</div>

					{/* Detailed Content */}
					<div className="space-y-1.5">
						<Label htmlFor="content" className="text-xs font-semibold">
							Detailed Review *
						</Label>
						<Textarea
							id="content"
							name="content"
							defaultValue={existingReview?.content ?? ""}
							placeholder="Describe your overall experience using this product..."
							rows={4}
							required
							className="text-sm resize-none"
						/>
						{state?.errors?.content && (
							<p className="text-xs text-destructive">
								{state.errors.content[0]}
							</p>
						)}
					</div>

					{/* Pros & Cons */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="pros" className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
								<ThumbsUp className="size-3" /> Pros (What works)
							</Label>
							<Textarea
								id="pros"
								name="pros"
								defaultValue={existingReview?.pros ?? ""}
								placeholder="e.g. Super intuitive onboarding, snappy performance"
								rows={2}
								className="text-xs resize-none"
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="cons" className="text-xs font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
								<ThumbsDown className="size-3" /> Cons (Room for improvement)
							</Label>
							<Textarea
								id="cons"
								name="cons"
								defaultValue={existingReview?.cons ?? ""}
								placeholder="e.g. Needs dark mode support, export options"
								rows={2}
								className="text-xs resize-none"
							/>
						</div>
					</div>

					{state?.message && !state.success && (
						<p className="text-xs text-destructive">{state.message}</p>
					)}

					<div className="flex justify-end gap-2 pt-2 border-t">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isPending}
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
							className="gap-2"
						>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									{existingReview ? "Updating..." : "Submitting..."}
								</>
							) : (
								<>
									<PenSquare className="size-4" />
									{existingReview ? "Update Review" : "Submit Review"}
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

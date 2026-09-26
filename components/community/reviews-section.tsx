"use client";

import DeleteConfirmDialog from "@/components/common/delete-confirm-dialog";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
	addReviewAction,
	deleteReviewAction,
} from "@/lib/community/community-actions";
import { cn, formatDate } from "@/lib/utils";
import { ProductReviewType, ReviewStatsType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	HeartHandshake,
	Loader2,
	PenSquare,
	SendHorizonal,
	Star,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import EmptyState from "../common/empty-state";
import StarRating from "./star-rating";

interface ReviewsSectionProps {
	productId: number;
	productName: string;
	reviews: ProductReviewType[];
	stats?: ReviewStatsType;
	reviewStats?: ReviewStatsType;
}

export default function ReviewsSection({
	productId,
	productName,
	reviews,
	stats,
	reviewStats: rawReviewStats,
}: ReviewsSectionProps) {
	const { isSignedIn, userId } = useAuth();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const reviewStats = stats ??
		rawReviewStats ?? {
			averageRating: 0,
			totalReviews: reviews.length,
			averageUxRating: 0,
			averagePricingRating: 0,
			ratingDistribution: {},
		};

	const userExistingReview = reviews.find((r) => r.userId === userId);

	return (
		<div className="space-y-8">
			{/* Top Summary Banner */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h3 className="text-xl font-bold">
							Reviews & Product Ratings
						</h3>
						{/* {reviewStats.totalReviews > 0 && (
							<Badge variant="secondary" className="text-xs">
								{reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "review" : "reviews"}
							</Badge>
						)} */}
					</div>
					<p className="text-xs text-muted-foreground">
						Authentic feedback and detailed UX ratings from builders
						and early testers.
					</p>
				</div>

				{isSignedIn ? (
					<ReviewDialog
						productId={productId}
						productName={productName}
						existingReview={userExistingReview}
						isOpen={isDialogOpen}
						setIsOpen={setIsDialogOpen}
					/>
				) : (
					<Button asChild size="sm">
						<Link href="/sign-in">Sign In to Rate</Link>
					</Button>
				)}
			</div>

			{/* Review Scorecards Overview */}
			{reviewStats.totalReviews > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg border bg-card/60 shadow-xs">
					{/* Col 1: Big Number & Stars */}
					<div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r">
						<div className="text-4xl font-extrabold text-foreground tracking-tight">
							{reviewStats.averageRating.toFixed(1)}
						</div>
						<div className="flex items-center gap-1 my-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={cn(
										"size-5",
										star <=
											Math.round(
												reviewStats.averageRating,
											)
											? "text-amber-400 fill-amber-400"
											: "text-muted-foreground/30",
									)}
								/>
							))}
						</div>
						<p className="text-xs text-muted-foreground">
							Based on {reviewStats.totalReviews} community rating
							{reviewStats.totalReviews > 1 && "s"}
						</p>
					</div>

					{/* Col 2: Sub-category Ratings (UX, Pricing) */}
					<div className="space-y-4 justify-start flex flex-col p-4 border-b md:border-b-0 md:border-r">
						<div className="space-y-1.5">
							<div className="flex justify-between text-xs font-medium">
								<span className="flex items-center gap-1 text-muted-foreground">
									<Eye className="size-3.5" /> UX & Usability
								</span>
								<span className="font-bold">
									{reviewStats.averageUxRating.toFixed(1)} /
									5.0
								</span>
							</div>
							<Progress
								value={(reviewStats.averageUxRating / 5) * 100}
								className="h-2"
							/>
						</div>

						<div className="space-y-1.5">
							<div className="flex justify-between text-xs font-medium">
								<span className="flex items-center gap-1 text-muted-foreground">
									<HeartHandshake className="size-3.5" />{" "}
									Value & Pricing
								</span>
								<span className="font-bold">
									{reviewStats.averagePricingRating.toFixed(
										1,
									)}{" "}
									/ 5.0
								</span>
							</div>
							<Progress
								value={
									(reviewStats.averagePricingRating / 5) * 100
								}
								className="h-2"
							/>
						</div>
					</div>

					{/* Col 3: Star Breakdown Bars */}
					<div className="space-y-1.5 justify-center flex flex-col p-4">
						{[5, 4, 3, 2, 1].map((rating) => {
							const count =
								reviewStats.ratingDistribution[rating] || 0;
							const percentage =
								reviewStats.totalReviews > 0
									? (count / reviewStats.totalReviews) * 100
									: 0;

							return (
								<div
									key={rating}
									className="flex items-center gap-2 text-xs"
								>
									<span className="w-4 font-medium">
										{rating}★
									</span>
									<Progress
										value={percentage}
										className="h-1.5 flex-1"
									/>
									<span className="w-6 text-right text-muted-foreground">
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
					header="No reviews written yet"
					message={
						isSignedIn
							? "Have you tried this product? Be the first to leave a structured review and rating!"
							: "Sign in to leave the very first review for this project."
					}
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
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteReviewAction(review.id);
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error("Failed to delete review:", error);
		} finally {
		}
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
							{
								<Badge
									variant="secondary"
									className="text-[10px] py-0 px-1.5 gap-1 font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
								>
									<CheckCircle2 className="size-2.5" />
									Verified Tester
								</Badge>
							}
						</div>
						<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
							<span>{formatDate(review.createdAt)}</span>
						</div>
					</div>
				</div>

				{/* Rating Stars & Delete Option */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
						<Star className="size-3.5 fill-amber-400 text-amber-400" />
						<span className="text-xs font-bold text-amber-500 ml-1">
							{review.rating}.0
						</span>
					</div>

					{isAuthor && (
						<DeleteConfirmDialog
							open={deleteDialogOpen}
							onOpenChange={setDeleteDialogOpen}
							onConfirm={handleDelete}
							title="Delete your review?"
							description="This action cannot be undone. This will permanently remove your rating and feedback for this product."
							trigger={
								<Button
									variant="ghost"
									size="icon"
									className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
									title="Delete your review"
								>
									<Trash2 className="size-3.5" />
								</Button>
							}
						/>
					)}
				</div>
			</div>

			{/* Review Headline & Body */}
			<div className="space-y-2">
				<h4 className="font-bold text-base text-foreground">
					{review.title}
				</h4>
				<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
					{review.content}
				</p>
			</div>

			{/* Pros & Cons Section */}
			{(review.pros || review.cons) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
					{review.pros && (
						<div className="rounded-lg p-3 bg-emerald-500/5 border border-emerald-500/15 space-y-1">
							<div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
								<ThumbsUp className="size-3.5" />
								<span>What Works Well</span>
							</div>
							<p className="text-muted-foreground leading-relaxed pl-5">
								{review.pros}
							</p>
						</div>
					)}
					{review.cons && (
						<div className="rounded-lg p-3 bg-rose-500/5 border border-rose-500/15 space-y-1">
							<div className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
								<ThumbsDown className="size-3.5" />
								<span>Room for Improvement</span>
							</div>
							<p className="text-muted-foreground leading-relaxed pl-5">
								{review.cons}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// ---------------- Review Dialog / Modal Form ----------------
function ReviewDialog({
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

	useEffect(() => {
		if (state.success) {
			setIsOpen(false);
		}
	}, [state.success, setIsOpen]);

	const handleSubmit = async (formData: FormData) => {
		formData.set("productId", productId.toString());
		formData.set("rating", rating.toString());
		formData.set("uxRating", uxRating.toString());
		formData.set("pricingRating", pricingRating.toString());
		formAction(formData);
	};

	const getFieldErrors = (fieldName: string): string[] => {
		if (!state.errors) return [];
		return (state.errors as Record<string, string[]>)[fieldName] ?? [];
	};

	const titleErrors = getFieldErrors("title");
	const contentErrors = getFieldErrors("content");
	const prosErrors = getFieldErrors("pros");
	const consErrors = getFieldErrors("cons");

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="gap-2 shrink-0 font-semibold cursor-pointer"
				>
					<PenSquare className="size-4" />
					{existingReview ? "Edit Your Review" : "Write a Review"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{existingReview ? "Update Review for" : "Review & Rate"}{" "}
						{productName}
					</DialogTitle>
					<DialogDescription>
						Provide honest, structured feedback to help the maker
						improve and guide community members.
					</DialogDescription>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4 pt-2">
					{state?.message && !state.success && (
						<div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 text-xs">
							<AlertCircle className="size-4 shrink-0 mt-0.5" />
							<span>{state.message}</span>
						</div>
					)}

					{/* Interactive Rating Pickers */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border bg-muted/40">
						<div className="space-y-1 items-center flex flex-col">
							<Label className="text-xs font-semibold">
								Overall Rating *
							</Label>
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
							<Label className="text-xs font-semibold">
								UX & Design
							</Label>
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
							<Label className="text-xs font-semibold">
								Value / Pricing
							</Label>
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
						<Label
							htmlFor="title"
							className="text-xs font-semibold"
						>
							Review Title / Summary{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							id="title"
							name="title"
							defaultValue={existingReview?.title ?? ""}
							placeholder="e.g., Clean UI and fast workflow, highly recommended!"
							required
							className={cn(
								"text-sm",
								titleErrors.length > 0 && "border-destructive",
							)}
						/>
						{titleErrors.length > 0 && (
							<div className="flex items-center gap-1 text-xs text-destructive">
								<AlertCircle className="size-3" />
								<span>{titleErrors.join(", ")}</span>
							</div>
						)}
					</div>

					{/* Detailed Content */}
					<div className="space-y-1.5">
						<Label
							htmlFor="content"
							className="text-xs font-semibold"
						>
							Detailed Review{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="content"
							name="content"
							defaultValue={existingReview?.content ?? ""}
							placeholder="Share your authentic experience: What did you build? How is the performance? Any gotchas?"
							rows={4}
							required
							className={cn(
								"resize-none text-sm",
								contentErrors.length > 0 &&
									"border-destructive",
							)}
						/>
						{contentErrors.length > 0 && (
							<div className="flex items-center gap-1 text-xs text-destructive">
								<AlertCircle className="size-3" />
								<span>{contentErrors.join(", ")}</span>
							</div>
						)}
					</div>

					{/* Pros & Cons (Optional) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label
								htmlFor="pros"
								className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
							>
								<ThumbsUp className="size-3" /> Pros / Strengths
							</Label>
							<Textarea
								id="pros"
								name="pros"
								defaultValue={existingReview?.pros ?? ""}
								placeholder="e.g. Sub-second load times, intuitive navigation"
								rows={2}
								className={cn(
									"resize-none text-xs",
									prosErrors.length > 0 &&
										"border-destructive",
								)}
							/>
							{prosErrors.length > 0 && (
								<p className="text-xs text-destructive">
									{prosErrors.join(", ")}
								</p>
							)}
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="cons"
								className="text-xs font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400"
							>
								<ThumbsDown className="size-3" /> Cons /
								Limitations
							</Label>
							<Textarea
								id="cons"
								name="cons"
								defaultValue={existingReview?.cons ?? ""}
								placeholder="e.g. Missing webhook integration"
								rows={2}
								className={cn(
									"resize-none text-xs",
									consErrors.length > 0 &&
										"border-destructive",
								)}
							/>
							{consErrors.length > 0 && (
								<p className="text-xs text-destructive">
									{consErrors.join(", ")}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setIsOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
							className="font-semibold cursor-pointer"
						>
							{isPending ? (
								<>
									<Loader2 className="size-3.5 animate-spin mr-1" />
									{existingReview
										? "Updating..."
										: "Submitting..."}
								</>
							) : (
								<>
									<SendHorizonal className="size-3.5 mr-1" />
									{existingReview
										? "Update Review"
										: "Submit Review"}
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

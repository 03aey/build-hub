"use client";

import DeleteConfirmDialog from "@/components/common/delete-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	addCommentAction,
	deleteCommentAction,
	upvoteCommentAction,
} from "@/lib/community/community-actions";
import { DISCUSSION_CATEGORIES } from "@/lib/data/site-data";
import { cn, formatTimeAgo } from "@/lib/utils";
import { NestedCommentType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import {
	AlertCircle,
	ChevronDown,
	CornerDownRight,
	Loader2,
	Send,
	Sparkles,
	ThumbsUp,
	Trash2,
	User,
} from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import EmptyState from "../common/empty-state";

interface DiscussionSectionProps {
	productId: number;
	comments: NestedCommentType[];
	isMaker: boolean;
	productSlug: string;
}

export default function DiscussionSection({
	productId,
	comments,
	isMaker,
}: DiscussionSectionProps) {
	const { isSignedIn, userId } = useAuth();
	const [activeCategory, setActiveCategory] = useState("all");
	const [replyingToId, setReplyingToId] = useState<number | null>(null);

	const filteredComments = comments.filter((c) => {
		if (activeCategory === "all") return true;
		return c.category === activeCategory;
	});

	return (
		<div className="space-y-8">
			{/* Top Bar & Filters */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h3 className="text-xl font-bold">Community Discussion</h3>
					</div>
					<p className="text-xs text-muted-foreground">
						Ask questions, report bugs, suggest features, or chat with the maker and community.
					</p>
				</div>

				{/* Filter Pills */}
				<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
					{DISCUSSION_CATEGORIES.map((cat) => {
						const isSelected = activeCategory === cat.id;
						const Icon = cat.icon;
						const count =
							cat.id === "all"
								? comments.length
								: comments.filter((c) => c.category === cat.id).length;

						return (
							<button
								key={cat.id}
								type="button"
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border",
									isSelected
										? "bg-primary text-primary-foreground border-primary shadow-xs"
										: "bg-background text-muted-foreground hover:text-foreground hover:bg-muted border-border/60",
								)}
							>
								<Icon className="size-3.5" />
								<span>{cat.label}</span>
								{count > 0 && (
									<span
										className={cn(
											"text-[10px] px-1.5 py-0.2 rounded-full",
											isSelected
												? "bg-primary-foreground/20 text-primary-foreground font-bold"
												: "bg-muted text-muted-foreground",
										)}
									>
										{count}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Main New Comment Box */}
			{isSignedIn ? (
				<CommentForm
					productId={productId}
					onSuccess={() => { }}
					placeholder={
						isMaker
							? "Share a note or answer community questions as the maker..."
							: "Ask the creator a question, report a bug, or share constructive feedback..."
					}
				/>
			) : (
				<div className="rounded-lg border border-dashed p-6 text-center bg-muted/20">
					<p className="text-sm text-muted-foreground mb-3">
						Sign in to ask questions, share feedback, report bugs, or participate in the discussion.
					</p>
					<Button asChild size="sm">
						<a href="/sign-in">Sign In to Join Discussion</a>
					</Button>
				</div>
			)}

			{/* Comments List */}
			<div className="space-y-4">
				{filteredComments.length > 0 ? (
					filteredComments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							productId={productId}
							currentUserId={userId}
							isMaker={isMaker}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
						/>
					))
				) : (
					<EmptyState
						header={
							activeCategory === "all"
								? "No discussions yet"
								: `No ${DISCUSSION_CATEGORIES.find((c) => c.id === activeCategory)?.label.toLowerCase()} yet`
						}
						message={
							activeCategory === "all"
								? "Be the first one to start a discussion or ask a question about this project!"
								: `No threads found in this category. Be the first to start one!`
						}
					/>
				)}
			</div>
		</div>
	);
}

// ---------------- Comment Form Component ----------------
function CommentForm({
	productId,
	parentId,
	placeholder,
	onSuccess,
	onCancel,
}: {
	productId: number;
	parentId?: number;
	placeholder: string;
	onSuccess: () => void;
	onCancel?: () => void;
}) {
	const [category, setCategory] = useState("general");
	const [state, formAction, isPending] = useActionState(addCommentAction, {
		success: false,
		message: "",
	});
	const [content, setContent] = useState("");

	useEffect(() => {
		if (state.success) {
			setContent("");
			onSuccess();
		}
	}, [state.success, onSuccess]);

	const handleSubmit = async (formData: FormData) => {
		if (!content.trim()) return;
		formData.set("content", content);
		formData.set("category", category);
		if (parentId) formData.set("parentId", parentId.toString());
		formData.set("productId", productId.toString());
		formAction(formData);
	};

	return (
		<form
			action={handleSubmit}
			className="border rounded-lg p-4 bg-background shadow-xs space-y-3"
		>
			{!parentId && (
				<div className="flex flex-wrap items-center gap-2 pb-2 border-b">
					{DISCUSSION_CATEGORIES.filter((c) => c.id !== "all").map((t) => {
						const isSelected = category === t.id;
						const Icon = t.icon;
						return (
							<button
								key={t.id}
								type="button"
								onClick={() => setCategory(t.id)}
								className={cn(
									"flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
									isSelected
										? "bg-primary text-primary-foreground font-semibold"
										: "bg-muted text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon className="size-3" />
								<span>{t.label}</span>
							</button>
						);
					})}
				</div>
			)}

			<Textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder={placeholder}
				rows={parentId ? 2 : 3}
				maxLength={2000}
				className={cn(
					"resize-none text-sm border-0 focus-visible:ring-0 p-0 shadow-none",
					state?.errors?.content && "border-destructive",
				)}
				required
			/>

			{state?.message && !state.success && (
				<div className="flex items-center gap-1.5 text-xs text-destructive pt-1">
					<AlertCircle className="size-3.5 shrink-0" />
					<span>{state.message}</span>
				</div>
			)}

			<div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
				<span>{content.length}/2000 chars</span>
				<div className="flex items-center gap-2">
					{onCancel && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onCancel}
							disabled={isPending}
							className="h-8 px-3 text-xs"
						>
							Cancel
						</Button>
					)}
					<Button
						type="submit"
						size="sm"
						disabled={isPending || !content.trim()}
						className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
					>
						{isPending ? (
							<>
								<Loader2 className="size-3.5 mr-1 animate-spin" />
								{parentId ? "Replying..." : "Posting..."}
							</>
						) : (
							<>
								<Send className="size-3.5 mr-1" />
								{parentId ? "Post Reply" : "Post Comment"}
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}

// ---------------- Comment Item Component ----------------
function CommentItem({
	comment,
	productId,
	currentUserId,
	isMaker,
	replyingToId,
	setReplyingToId,
	isReply = false,
}: {
	comment: NestedCommentType;
	productId: number;
	currentUserId?: string | null;
	isMaker: boolean;
	replyingToId: number | null;
	setReplyingToId: (id: number | null) => void;
	isReply?: boolean;
}) {
	const [upvotes, setUpvotes] = useState(comment.upvotes);
	const [hasUpvoted, setHasUpvoted] = useState(
		Boolean(currentUserId && comment.upvotedBy?.includes(currentUserId)),
	);
	const [isPendingVote, startTransition] = useTransition();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const isMakerComment = comment.userRole === "maker";
	const isCommentOwner = currentUserId && comment.userId === currentUserId;
	const canDelete = isCommentOwner || isMaker;

	const handleUpvote = () => {
		if (!currentUserId || isPendingVote) return;
		startTransition(async () => {
			const nextState = !hasUpvoted;
			setHasUpvoted(nextState);
			setUpvotes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
			await upvoteCommentAction(comment.id);
		});
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await deleteCommentAction(comment.id);
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error("Failed to delete comment:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const categoryConfig = DISCUSSION_CATEGORIES.find((c) => c.id === comment.category);

	return (
		<div
			className={cn(
				"rounded-lg border p-4 transition-all bg-card",
				isMakerComment && "border-primary/30 bg-primary/5",
				isReply && "ml-4 border-l-2 border-l-primary/50 mt-2",
			)}
		>
			<div className="flex items-start justify-between gap-3">
				{/* Author Info */}
				<div className="flex items-center gap-2.5">
					<div className="size-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
						{comment.userAvatar ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={comment.userAvatar}
								alt={comment.userName}
								className="size-full object-cover"
							/>
						) : (
							<User className="size-4 text-muted-foreground" />
						)}
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm">
								{comment.userName}
							</span>
							{isMakerComment && (
								<Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 text-[10px] py-0 px-1.5 gap-1 font-semibold">
									<Sparkles className="size-2.5" />
									Maker
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
							<span>{formatTimeAgo(comment.createdAt)}</span>
							{categoryConfig && categoryConfig.id !== "general" && (
								<>
									<span>•</span>
									<span
										className={cn(
											"px-1.5 py-0.2 rounded font-medium",
											categoryConfig.color,
										)}
									>
										{categoryConfig.label}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Reusable Delete Confirmation Dialog */}
				{canDelete && (
					<DeleteConfirmDialog
						open={deleteDialogOpen}
						onOpenChange={setDeleteDialogOpen}
						onConfirm={handleDelete}
						title={`Delete this ${isReply ? "reply" : "comment"}?`}
						description={`This action cannot be undone. This will permanently delete this discussion comment${!isReply ? " and any replies underneath it." : "."}`}
						trigger={
							<Button
								variant="ghost"
								size="icon"
								className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
								title="Delete comment"
							>
								<Trash2 className="size-3.5" />
							</Button>
						}
					/>
				)}
			</div>

			{/* Comment Content */}
			<div className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
				{comment.content}
			</div>

			{/* Bottom Bar (Upvote & Reply) */}
			<div className="mt-2 flex items-center gap-3 pt-2 border-t border-border/40 text-xs">
				<button
					type="button"
					onClick={handleUpvote}
					className={cn(
						"flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
						hasUpvoted
							? "bg-primary/20 text-primary font-bold"
							: "hover:bg-muted text-muted-foreground hover:text-foreground",
						"disabled:cursor-default disabled:opacity-80 disabled:bg-transparent",
					)}
					disabled={isPendingVote || !currentUserId}
				>
					<ThumbsUp
						className={cn("size-3.5", hasUpvoted && "fill-primary")}
					/>
					<span>{upvotes}</span>
				</button>

				{!isReply && currentUserId && (
					<button
						type="button"
						onClick={() =>
							setReplyingToId(
								replyingToId === comment.id ? null : comment.id,
							)
						}
						className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
					>
						<CornerDownRight className="size-3.5" />
						<span>Reply</span>
					</button>
				)}

				{comment.replies && comment.replies.length > 0 && (
					<button
						type="button"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="ml-auto text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs cursor-pointer font-medium"
					>
						<span>
							{comment.replies.length}{" "}
							{comment.replies.length === 1 ? "reply" : "replies"}
						</span>
						<ChevronDown
							className={cn(
								"size-3 transition-transform",
								isCollapsed && "-rotate-90",
							)}
						/>
					</button>
				)}
			</div>

			{/* Inline Reply Form */}
			{replyingToId === comment.id && (
				<div className="mt-3 pt-3 border-t">
					<CommentForm
						productId={productId}
						parentId={comment.id}
						placeholder={`Reply to ${comment.userName}...`}
						onSuccess={() => setReplyingToId(null)}
						onCancel={() => setReplyingToId(null)}
					/>
				</div>
			)}

			{/* Nested Replies */}
			{comment.replies && comment.replies.length > 0 && !isCollapsed && (
				<div className="space-y-2 mt-2">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							productId={productId}
							currentUserId={currentUserId}
							isMaker={isMaker}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
							isReply={true}
						/>
					))}
				</div>
			)}
		</div>
	);
}

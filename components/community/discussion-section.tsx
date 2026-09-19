"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	addCommentAction,
	deleteCommentAction,
	upvoteCommentAction,
} from "@/lib/community/community-actions";
import { cn } from "@/lib/utils";
import { NestedCommentType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import {
	Bug,
	ChevronDown,
	CornerDownRight,
	HelpCircle,
	Lightbulb,
	Loader2,
	MessageSquare,
	MessagesSquare,
	Send,
	Sparkles,
	ThumbsUp,
	Trash2,
	User
} from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import EmptyState from "../common/empty-state";

interface DiscussionSectionProps {
	productId: number;
	comments: NestedCommentType[];
	isMaker: boolean;
	productSlug: string;
}

const CATEGORIES = [
	{ id: "all", label: "All Topics", icon: MessagesSquare },
	{ id: "question", label: "Questions | Q&A", icon: HelpCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
	{ id: "feedback", label: "Feedback & Ideas", icon: Lightbulb, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
	{ id: "bug", label: "Bug Reports", icon: Bug, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
	{ id: "general", label: "General Chat", icon: MessageSquare, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

function formatTimeAgo(dateString?: string | Date | null) {
	if (!dateString) return "Just now";
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours}h ago`;
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) return `${diffInDays}d ago`;
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
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
						{/* <MessageSquare className="size-5 text-primary" /> */}
						<h3 className="text-xl font-bold">Community Discussion</h3>
						{/* <Badge variant="secondary" className="text-xs">
						{comments.length}
					</Badge> */}
					</div>
					<p className="text-xs text-muted-foreground">
						Ask questions, share feedback, and connect with other users.
					</p>
				</div>

				{/* Category Pill Filters */}
				<div className="flex flex-wrap items-center gap-1.5">
					{CATEGORIES.map((cat) => {
						const Icon = cat.icon;
						const isActive = activeCategory === cat.id;
						return (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={cn(
									"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
									isActive
										? "bg-primary text-primary-foreground shadow-xs"
										: "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<Icon className="size-3.5" />
								<span>{cat.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Main Comment Creation Box */}
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
				<div className="p-4 py-8 rounded-lg border bg-muted/30 text-center space-y-2">
					<p className="text-sm font-medium">Join the discussion</p>
					<p className="text-xs text-muted-foreground">
						Sign in to ask questions, suggest improvements, and connect with makers.
					</p>
				</div>
			)}

			{/* Comment Threads List */}
			<div className="space-y-4">
				{filteredComments.length === 0 ? (
					<EmptyState
						header="No discussions yet"
						message={activeCategory === "all"
							? "Be the first to start a conversation, ask a question, or leave feedback."
							: `No discussions found under "${CATEGORIES.find((c) => c.id === activeCategory)?.label}".`}
					/>
				) : (
					filteredComments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							productId={productId}
							currentUserId={userId}
							isProductMaker={isMaker}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
						/>
					))
				)}
			</div>
		</div>
	);
}

// ---------------- Comment Form ----------------
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

	const handleSubmit = async (formData: FormData) => {
		if (!content.trim()) return;
		formData.set("content", content);
		formData.set("category", category);
		if (parentId) formData.set("parentId", parentId.toString());
		formData.set("productId", productId.toString());
		formAction(formData);
		setContent("");
		onSuccess();
	};

	return (
		<form action={handleSubmit} className="border rounded-lg p-4 bg-background shadow-xs space-y-3">
			{!parentId && (
				<div className="flex flex-wrap items-center gap-2 pb-2 border-b">
					<span className="text-xs font-semibold text-muted-foreground">Type:</span>
					{[
						{ id: "general", label: "General", icon: MessageSquare },
						{ id: "question", label: "Question", icon: HelpCircle },
						{ id: "feedback", label: "Feedback", icon: Lightbulb },
						{ id: "bug", label: "Bug Report", icon: Bug },
					].map((t) => {
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
										? "bg-primary text-primary-foreground"
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
				className="resize-none text-sm border-0 focus-visible:ring-0 p-0 shadow-none"
				required
			/>

			{state?.message && !state.success && (
				<p className="text-sm text-destructive">{state.message}</p>
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
						className="h-8 gap-1.5 text-xs"
					>
						{isPending ? (
							<>
								<Loader2 className="size-3 animate-spin" />
								Posting...
							</>
						) : (
							<>
								<Send className="size-3" />
								{parentId ? "Post Reply" : "Post Comment"}
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}

// ---------------- Comment Item ----------------
function CommentItem({
	comment,
	productId,
	currentUserId,
	isProductMaker,
	replyingToId,
	setReplyingToId,
	isReply = false,
}: {
	comment: NestedCommentType;
	productId: number;
	currentUserId?: string | null;
	isProductMaker: boolean;
	replyingToId: number | null;
	setReplyingToId: (id: number | null) => void;
	isReply?: boolean;
}) {
	const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
	const [hasUpvoted, setHasUpvoted] = useState(
		Boolean(currentUserId && comment.upvotedBy?.includes(currentUserId)),
	);
	const [isPendingVote, startTransition] = useTransition();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const isAuthor = currentUserId === comment.userId;
	const canDelete = isAuthor || isProductMaker;
	const isMakerComment = comment.userRole === "maker";

	const handleUpvote = () => {
		if (!currentUserId) return;
		startTransition(async () => {
			const nextState = !hasUpvoted;
			setHasUpvoted(nextState);
			setUpvotes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
			await upvoteCommentAction(comment.id);
		});
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this comment?")) return;
		setIsDeleting(true);
		await deleteCommentAction(comment.id);
		setIsDeleting(false);
	};

	const categoryConfig = CATEGORIES.find((c) => c.id === comment.category);

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
					<div>
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
									<span className={cn("px-1.5 py-0.2 rounded font-medium", categoryConfig.color)}>
										{categoryConfig.label}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Actions (Delete) */}
				{canDelete && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleDelete}
						disabled={isDeleting}
						className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
					>
						<Trash2 className="size-3.5" />
					</Button>
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
					<ThumbsUp className={cn("size-3.5", hasUpvoted && "fill-primary")} />
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
						<span>{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
						<ChevronDown className={cn("size-3 transition-transform", isCollapsed && "-rotate-90")} />
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
							isProductMaker={isProductMaker}
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

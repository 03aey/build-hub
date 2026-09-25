"use client";

import EmptyState from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { removeBookmarkAction } from "@/lib/bookmarks/bookmark-actions";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BookmarkListSummaryType,
	BookmarkWithProductType,
	DEFAULT_BOOKMARK_LISTS,
} from "@/types";
import { toast } from "sonner";
import {
	Edit,
	FileSymlink,
	Folder,
	Layers,
	Loader2,
	Search,
	StickyNote,
	ThumbsUp,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import BookmarkEditDialog from "./bookmark-edit-dialog";

interface BookmarksViewProps {
	initialBookmarks: BookmarkWithProductType[];
	lists: BookmarkListSummaryType[];
}

export default function BookmarksView({
	initialBookmarks,
	lists,
}: BookmarksViewProps) {
	const pathname = usePathname();
	const [activeList, setActiveList] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortBy, setSortBy] = useState<"newest" | "upvotes" | "name">(
		"newest",
	);
	const [editingBookmark, setEditingBookmark] =
		useState<BookmarkWithProductType | null>(null);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [, startTransition] = useTransition();

	// Distinct list names combining defaults and populated lists
	const listNames = useMemo(() => {
		const set = new Set<string>(DEFAULT_BOOKMARK_LISTS);
		lists.forEach((l) => set.add(l.name));
		initialBookmarks.forEach((b) => {
			if (b.listName) set.add(b.listName);
		});
		return Array.from(set);
	}, [lists, initialBookmarks]);

	// Filter & Sort bookmarks
	const filteredBookmarks = useMemo(() => {
		return initialBookmarks
			.filter((b) => {
				// List filter
				if (activeList !== "all" && b.listName !== activeList) {
					return false;
				}

				// Search query
				if (searchQuery.trim()) {
					const q = searchQuery.toLowerCase();
					const matchName = b.product.name.toLowerCase().includes(q);
					const matchTagline = b.product.tagline
						?.toLowerCase()
						.includes(q);
					const matchNotes = b.notes?.toLowerCase().includes(q);
					const matchTags = b.product.tags?.some((t) =>
						t.toLowerCase().includes(q),
					);

					if (
						!matchName &&
						!matchTagline &&
						!matchNotes &&
						!matchTags
					) {
						return false;
					}
				}

				return true;
			})
			.sort((a, b) => {
				if (sortBy === "upvotes") {
					return (
						(b.product.voteCount ?? 0) - (a.product.voteCount ?? 0)
					);
				}
				if (sortBy === "name") {
					return a.product.name.localeCompare(b.product.name);
				}
				// Default newest
				const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
				const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
				return dateB - dateA;
			});
	}, [initialBookmarks, activeList, searchQuery, sortBy]);

	const handleDeleteBookmark = (bookmarkId: number, productName?: string) => {
		setDeletingId(bookmarkId);
		startTransition(async () => {
			const res = await removeBookmarkAction({
				bookmarkId,
				path: pathname,
			});
			setDeletingId(null);
			if (res.success) {
				toast.info(
					productName
						? `Removed "${productName}" from your saved list.`
						: "Product removed from your bookmarks.",
				);
			} else {
				toast.error("Failed to remove bookmark");
			}
		});
	};

	return (
		<div className="space-y-4">
			{/* Top Bar: Lists & Search Controls */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{/* List Filter Tabs */}
				<div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
					<button
						type="button"
						onClick={() => setActiveList("all")}
						className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
							activeList === "all"
								? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
								: "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
						}`}
					>
						<Layers className="size-3.5" />
						<span>All Bookmarks</span>
						<span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted">
							{initialBookmarks.length}
						</span>
					</button>

					{listNames.map((name) => {
						const count = initialBookmarks.filter(
							(b) => b.listName === name,
						).length;
						return (
							<button
								key={name}
								type="button"
								onClick={() => setActiveList(name)}
								className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
									activeList === name
										? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
										: "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
								}`}
							>
								<Folder className="size-3.5" />
								<span>{name}</span>
								<span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted">
									{count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Search & Sort Controls */}
				<div className="flex items-center gap-2">
					<div className="relative w-full sm:w-60">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							placeholder="Search saved tools & notes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8 text-xs h-8 rounded-lg bg-card/60"
						/>
					</div>

					<Select
						value={sortBy}
						onValueChange={(val) =>
							setSortBy(val as "newest" | "upvotes" | "name")
						}
					>
						<SelectTrigger
							size="sm"
							className="h-8 text-xs rounded-lg border-border/60 bg-card/60 w-36 cursor-pointer"
						>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Sort By</SelectLabel>
								<SelectItem value="newest">
									Newest First
								</SelectItem>
								<SelectItem value="upvotes">
									Most Upvoted
								</SelectItem>
								<SelectItem value="name">Name (A-Z)</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Bookmarked Products Grid */}
			{filteredBookmarks.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{filteredBookmarks.map((item) => {
						const { product } = item;
						const isDeleting = deletingId === item.id;

						return (
							<Card
								key={item.id}
								className={`rounded-lg border-border/60 bg-card/60 hover:bg-card hover:border-border transition-all flex flex-col py-0 justify-between overflow-hidden relative group ${
									isDeleting
										? "opacity-50 pointer-events-none"
										: ""
								}`}
							>
								<div>
									<CardHeader className="p-4 space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-start gap-2.5 min-w-0">
												<div className="size-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 text-sm">
													{product.name
														.slice(0, 2)
														.toUpperCase()}
												</div>
												<div className="min-w-0">
													<Link
														href={`/products/${product.slug}`}
														className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
													>
														{product.name}
													</Link>
													<p className="text-[11px] text-muted-foreground line-clamp-1">
														{product.tagline ||
															"Software Tool"}
													</p>
												</div>
											</div>

											{/* List Badge */}
											<Badge
												variant="outline"
												className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/20 shrink-0"
											>
												{item.listName ||
													"Want to Test"}
											</Badge>
										</div>

										<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
											{product.description ||
												product.tagline}
										</p>
									</CardHeader>

									<CardContent className="px-4 pb-3 space-y-3">
										{/* Tags */}
										{product.tags &&
											product.tags.length > 0 && (
												<div className="flex flex-wrap gap-1">
													{product.tags
														.slice(0, 3)
														.map((tag) => (
															<Badge
																variant="secondary"
																key={tag}
																className="lowercase"
															>
																{tag}
															</Badge>
														))}
												</div>
											)}

										{/* Personal Notes Memo */}
										{item.notes && (
											<div className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 space-y-1">
												<div className="flex items-center gap-1 font-semibold text-[11px]">
													<StickyNote className="size-3" />
													<span>Personal Memo:</span>
												</div>
												<p className="text-[11px] text-muted-foreground line-clamp-2 leading-normal">
													{item.notes}
												</p>
											</div>
										)}
									</CardContent>
								</div>

								{/* Bottom Card Footer Actions */}
								<div className="p-3 px-4 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-2 text-xs">
									<div className="flex items-center gap-3 text-muted-foreground text-[11px]">
										<span className="flex items-center gap-1">
											<ThumbsUp className="size-3 text-primary" />
											<span className="font-medium">
												{product.voteCount}
											</span>
										</span>
									</div>

									<div className="flex items-center gap-1.5">
										{/* Edit list/notes */}
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												setEditingBookmark(item)
											}
											className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
											title="Edit list name or notes"
										>
											<Edit className="size-3.5" />
										</Button>

										{/* External visit */}
										{product.websiteUrl && (
											<Button
												asChild
												variant="ghost"
												size="sm"
												className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
												title="Open live website"
											>
												<Link
													href={product.websiteUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<FileSymlink className="size-3.5" />
												</Link>
											</Button>
										)}

										{/* Remove bookmark */}
										<Button
											variant="ghost"
											size="sm"
											disabled={isDeleting}
											onClick={() =>
												handleDeleteBookmark(
													item.id,
													product.name,
												)
											}
											className="size-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
											title="Remove from saved"
										>
											{isDeleting ? (
												<Loader2 className="size-3.5 animate-spin" />
											) : (
												<Trash2 className="size-3.5" />
											)}
										</Button>

										{/* View product */}
										<Button
											asChild
											variant="outline"
											className="h-7 text-xs px-5 rounded-md font-medium"
										>
											<Link
												href={`/products/${product.slug}`}
											>
												View
											</Link>
										</Button>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				<EmptyState
					header={
						searchQuery || activeList !== "all"
							? "No Matching Bookmarks"
							: "No Saved Products Yet"
					}
					message={
						searchQuery || activeList !== "all"
							? `No saved tools found matching your current filter. Try resetting search or switching lists.`
							: "You haven't bookmarked any tools yet. Browse community launches on Explore and click 'Save for Later' to build your testing playlist!"
					}
				/>
			)}

			{/* Edit Bookmark Dialog */}
			<BookmarkEditDialog
				bookmark={editingBookmark}
				isOpen={Boolean(editingBookmark)}
				onClose={() => setEditingBookmark(null)}
				existingLists={listNames}
			/>
		</div>
	);
}

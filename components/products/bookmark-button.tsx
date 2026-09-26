"use client";

import {
	directToggleBookmarkAction,
	getBookmarkStatusAction,
	saveBookmarkWithListAction,
} from "@/lib/bookmarks/bookmark-actions";
import { DEFAULT_BOOKMARK_LISTS } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { Bookmark, Check, FolderCheck, Loader2, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface BookmarkButtonProps {
	productId: number;
	productName?: string;
	initialIsBookmarked?: boolean;
	initialListName?: string;
	variant?: "default" | "outline" | "secondary" | "ghost";
	size?: "default" | "sm" | "lg" | "icon";
	showLabel?: boolean;
	className?: string;
}

export default function BookmarkButton({
	productId,
	productName = "this product",
	initialIsBookmarked = false,
	initialListName = "Want to Test",
	variant = "outline",
	size = "default",
	showLabel = true,
	className = "",
}: BookmarkButtonProps) {
	const { isSignedIn } = useAuth();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
	const [listName, setListName] = useState(initialListName || "Want to Test");
	const [isListModalOpen, setIsListModalOpen] = useState(false);
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (initialIsBookmarked) {
			setIsBookmarked(true);
			if (initialListName) setListName(initialListName);
		}
	}, [initialIsBookmarked, initialListName]);

	useEffect(() => {
		if (!isSignedIn) {
			setIsBookmarked(false);
			return;
		}

		getBookmarkStatusAction(productId).then((status) => {
			if (status && status.isBookmarked) {
				setIsBookmarked(true);
				if (status.listName) setListName(status.listName);
				if (status.notes) setNotes(status.notes);
			} else {
				setIsBookmarked(false);
			}
		});
	}, [productId, isSignedIn]);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isSignedIn) {
			toast.error("Sign in required to save this tool.");
			return;
		}

		// Open list selection dialog to choose from existing lists
		setIsListModalOpen(true);
	};

	const handleQuickUnsave = () => {
		startTransition(async () => {
			const res = await directToggleBookmarkAction({
				productId,
				path: pathname,
			});

			if (res.success) {
				setIsBookmarked(false);
				setIsListModalOpen(false);
				toast.info(`Removed "${productName}" from bookmarks.`);
			} else {
				toast.error(res.message);
			}
		});
	};

	const handleSaveToList = async (e: React.FormEvent) => {
		e.preventDefault();
		const finalListName = listName || "Want to Test";

		setIsListModalOpen(false);
		setIsBookmarked(true);

		startTransition(async () => {
			const res = await saveBookmarkWithListAction({
				productId,
				listName: finalListName,
				notes: notes.trim() || null,
				path: pathname,
			});

			if (res.success) {
				setIsBookmarked(true);
				toast.success(res.message);
			} else {
				setIsBookmarked(initialIsBookmarked);
				toast.error(res.message);
			}
		});
	};

	return (
		<>
			<Button
				type="button"
				variant={isBookmarked ? "secondary" : variant}
				size={size}
				disabled={isPending}
				onClick={handleClick}
				className={`relative group transition-all duration-200 cursor-pointer ${
					isBookmarked
						? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
						: "hover:border-primary/40"
				} ${className}`}
				title={
					isBookmarked
						? `Bookmarked in "${listName}". Click to change list`
						: "Save / Bookmark product"
				}
			>
				{isPending ? (
					<Loader2 className="size-4 animate-spin shrink-0" />
				) : isBookmarked ? (
					<Bookmark className="size-4 text-primary fill-primary shrink-0 transition-transform group-hover:scale-110" />
				) : (
					<Bookmark className="size-4 shrink-0 transition-transform group-hover:scale-110" />
				)}

				{showLabel && (
					<span className="font-medium text-xs sm:text-sm">
						{isBookmarked
							? `Saved (${listName})`
							: "Save for Later"}
					</span>
				)}
			</Button>

			{/* Dialog for Selecting from Already Made Lists */}
			<Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
				<DialogContent
					className="sm:max-w-md rounded-lg"
					onClick={(e) => e.stopPropagation()}
				>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-base font-bold">
							<FolderCheck className="size-5 text-primary" />
							{isBookmarked
								? "Manage Bookmark:"
								: "Bookmark"}{" "}
							{productName}
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground">
							Choose which list to save this tool in, and
							optionally add testing notes.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSaveToList} className="space-y-4">
						{/* Already made list selector */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold">
									Select List
								</Label>
								<span className="text-[11px] text-muted-foreground">
									Choose one
								</span>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{DEFAULT_BOOKMARK_LISTS.map((list) => {
									const isSelected = listName === list;
									return (
										<button
											key={list}
											type="button"
											onClick={() => setListName(list)}
											className={`text-left text-xs p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
												isSelected
													? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
													: "border-border/60 bg-muted/20 hover:bg-muted/40 text-foreground"
											}`}
										>
											<span className="line-clamp-1">
												{list}
											</span>
											{isSelected && (
												<Check className="size-3.5 shrink-0 text-primary" />
											)}
										</button>
									);
								})}
							</div>
						</div>

						{/* Optional Notes */}
						<div className="space-y-1.5">
							<Label
								htmlFor="notes"
								className="text-xs font-semibold"
							>
								Personal Memo / Testing Notes (Optional)
							</Label>
							<Textarea
								id="notes"
								placeholder="e.g., Test API performance with team, compare with alternatives"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={2}
								className="text-xs resize-none"
							/>
						</div>

						<DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/40">
							{isBookmarked ? (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									disabled={isPending}
									onClick={handleQuickUnsave}
									className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 w-full sm:w-auto"
								>
									<Trash2 className="size-3.5" />
									<span>Remove Bookmark</span>
								</Button>
							) : (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setIsListModalOpen(false)}
									disabled={isPending}
									className="text-xs w-full sm:w-auto"
								>
									Cancel
								</Button>
							)}

							<Button
								type="submit"
								size="sm"
								disabled={isPending}
								className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
							>
								{isPending && (
									<Loader2 className="size-3.5 animate-spin" />
								)}
								{isBookmarked ? "Update List" : "Save to List"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}

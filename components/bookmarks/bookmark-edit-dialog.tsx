"use client";

import { updateBookmarkDetailsAction } from "@/lib/bookmarks/bookmark-actions";
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
import { BookmarkWithProductType } from "@/types";
import { Check, Edit, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { toast } from "sonner";

interface BookmarkEditDialogProps {
	bookmark: BookmarkWithProductType | null;
	isOpen: boolean;
	onClose: () => void;
	existingLists?: string[];
}

export default function BookmarkEditDialog({
	bookmark,
	isOpen,
	onClose,
	existingLists = [],
}: BookmarkEditDialogProps) {
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [listName, setListName] = useState("");
	const [notes, setNotes] = useState("");

	// Combine default lists with any user-passed lists
	const availableLists = useMemo(() => {
		const set = new Set<string>(DEFAULT_BOOKMARK_LISTS);
		existingLists.forEach((l) => {
			if (l && l !== "all") set.add(l);
		});
		if (bookmark?.listName) {
			set.add(bookmark.listName);
		}
		return Array.from(set);
	}, [existingLists, bookmark]);

	useEffect(() => {
		if (bookmark) {
			setListName(bookmark.listName || "Want to Test");
			setNotes(bookmark.notes || "");
		}
	}, [bookmark]);

	if (!bookmark) return null;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const finalListName = listName || "Want to Test";

		startTransition(async () => {
			const res = await updateBookmarkDetailsAction({
				bookmarkId: bookmark.id,
				listName: finalListName,
				notes: notes.trim() || null,
				path: pathname,
			});

			if (res.success) {
				toast.success(`Moved to "${finalListName}" list.`);
				onClose();
			} else {
				toast.error("Failed to update bookmark");
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md rounded-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-base font-bold">
						<Edit className="size-4 text-primary" />
						Edit Bookmark: {bookmark.product.name}
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Select a list to categorize this tool and update your
						personal testing notes.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSave} className="space-y-4">
					{/* Choose list from already made lists */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">
							Select List
						</Label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{availableLists.map((name) => {
								const isSelected = listName === name;
								return (
									<button
										key={name}
										type="button"
										onClick={() => setListName(name)}
										className={`text-left text-xs p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
											isSelected
												? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
												: "border-border/60 bg-muted/20 hover:bg-muted/40 text-foreground"
										}`}
									>
										<span className="line-clamp-1">
											{name}
										</span>
										{isSelected && (
											<Check className="size-3.5 shrink-0 text-primary" />
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Notes Input */}
					<div className="space-y-1.5">
						<Label
							htmlFor="editNotes"
							className="text-xs font-semibold"
						>
							Personal Memo / Testing Notes (Optional)
						</Label>
						<Textarea
							id="editNotes"
							placeholder="Add thoughts, trial results, or reminders for your team..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={3}
							className="text-xs resize-none"
						/>
					</div>

					<DialogFooter className="gap-2 pt-2 border-t border-border/40">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="text-xs"
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
							className="text-xs font-semibold gap-1.5"
						>
							{isPending && (
								<Loader2 className="size-3.5 animate-spin" />
							)}
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

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
import { Textarea } from "@/components/ui/textarea";
import {
	addChangelogAction,
	deleteChangelogAction,
} from "@/lib/community/community-actions";
import { CHANGELOG_CATEGORIES } from "@/lib/data/site-data";
import { cn, formatUpdateDate } from "@/lib/utils";
import { ChangelogCategoryId, ProductUpdateType } from "@/types";
import {
	AlertCircle,
	Calendar,
	Loader2,
	Plus,
	Send,
	Tag,
	Trash2,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import EmptyState from "../common/empty-state";

interface ChangelogSectionProps {
	productId: number;
	updates: ProductUpdateType[];
	isMaker: boolean;
	productName: string;
}

export default function ChangelogSection({
	productId,
	updates,
	isMaker,
	productName,
}: ChangelogSectionProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [state, formAction, isPending] = useActionState(addChangelogAction, {
		success: false,
		message: "",
	});
	const [selectedCategory, setSelectedCategory] = useState<ChangelogCategoryId>("feature");

	useEffect(() => {
		if (state?.success) {
			setIsOpen(false);
		}
	}, [state]);

	const handlePostSubmit = (formData: FormData) => {
		formData.set("productId", productId.toString());
		formData.set("category", selectedCategory);
		formAction(formData);
	};

	const getFieldErrors = (fieldName: string): string[] => {
		if (!state.errors) return [];
		return (state.errors as Record<string, string[]>)[fieldName] ?? [];
	};

	const titleErrors = getFieldErrors("title");
	const contentErrors = getFieldErrors("content");
	const versionErrors = getFieldErrors("version");

	return (
		<div className="space-y-8">
			{/* Header & Post Button */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h3 className="text-xl font-bold">Maker Changelog & Milestones</h3>
					</div>
					<p className="text-xs text-muted-foreground">
						Follow the journey, new features, and development progress of {productName}.
					</p>
				</div>

				{isMaker && (
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button size="sm" className="gap-2 shrink-0 font-semibold cursor-pointer">
								<Plus className="size-4" />
								Post New Update
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-xl">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2 text-lg">
									Post Changelog / Milestone Update
								</DialogTitle>
								<DialogDescription>
									Share a release, progress milestone, or announcement with your community.
								</DialogDescription>
							</DialogHeader>

							<form action={handlePostSubmit} className="space-y-4 pt-2">
								{state?.message && !state.success && (
									<div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 text-xs">
										<AlertCircle className="size-4 shrink-0 mt-0.5" />
										<span>{state.message}</span>
									</div>
								)}

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="space-y-1.5">
										<Label htmlFor="version" className="text-xs font-semibold">
											Version / Tag (Optional)
										</Label>
										<div className="relative">
											<Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
											<Input
												id="version"
												name="version"
												placeholder="e.g. v2.1.0 or Alpha-3"
												className="pl-8 text-sm"
											/>
										</div>
										{versionErrors.length > 0 && (
											<p className="text-xs text-destructive">{versionErrors.join(", ")}</p>
										)}
									</div>

									<div className="space-y-1.5">
										<Label className="text-xs font-semibold">Update Type</Label>
										<div className="grid grid-cols-2 gap-1.5">
											{(
												[
													"feature",
													"improvement",
													"milestone",
													"fix",
												] as const
											).map((cat) => {
												const config = CHANGELOG_CATEGORIES[cat];
												const isSelected = selectedCategory === cat;
												const Icon = config.icon;
												return (
													<button
														key={cat}
														type="button"
														onClick={() => setSelectedCategory(cat)}
														className={cn(
															"flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer text-left",
															isSelected
																? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
																: "bg-muted/50 border-transparent hover:bg-muted text-muted-foreground",
														)}
													>
														<Icon className="size-3 shrink-0" />
														<span className="truncate">{config.label}</span>
													</button>
												);
											})}
										</div>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="title" className="text-xs font-semibold">
										Update Headline <span className="text-destructive">*</span>
									</Label>
									<Input
										id="title"
										name="title"
										placeholder="e.g. Added real-time collaboration and dark mode"
										required
										className={cn("text-sm", titleErrors.length > 0 && "border-destructive")}
									/>
									{titleErrors.length > 0 && (
										<div className="flex items-center gap-1 text-xs text-destructive">
											<AlertCircle className="size-3" />
											<span>{titleErrors.join(", ")}</span>
										</div>
									)}
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="content" className="text-xs font-semibold">
										Changelog Details / Description <span className="text-destructive">*</span>
									</Label>
									<Textarea
										id="content"
										name="content"
										placeholder="Describe the changes, what's new, metrics achieved, or fixes deployed..."
										rows={4}
										required
										className={cn("resize-none text-sm", contentErrors.length > 0 && "border-destructive")}
									/>
									{contentErrors.length > 0 && (
										<div className="flex items-center gap-1 text-xs text-destructive">
											<AlertCircle className="size-3" />
											<span>{contentErrors.join(", ")}</span>
										</div>
									)}
								</div>

								<div className="flex justify-end gap-2 pt-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsOpen(false)}
										disabled={isPending}
									>
										Cancel
									</Button>
									<Button type="submit" disabled={isPending} className="gap-1.5">
										{isPending ? (
											<>
												<Loader2 className="size-4 animate-spin" />
												Publishing...
											</>
										) : (
											<>
												<Send className="size-4" />
												Publish Update
											</>
										)}
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</div>

			{/* Changelog Timeline List */}
			{updates.length === 0 ? (
				<EmptyState
					header="No Changelogs Published Yet"
					message={
						isMaker
							? "You haven't posted any updates yet. Click 'Post New Update' above to share your journey!"
							: "The maker hasn't posted any changelog updates yet. Check back soon for new features and progress!"
					}
				/>
			) : (
				<div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
					{updates.map((update) => {
						const config =
							CHANGELOG_CATEGORIES[(update.category as ChangelogCategoryId) ?? "feature"] ??
							CHANGELOG_CATEGORIES.feature;
						const Icon = config.icon;

						return (
							<div key={update.id} className="relative group">
								{/* Timeline node icon */}
								<div className="absolute -left-6 sm:-left-8 top-1.5 size-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary shadow-xs">
									<Icon className="size-3.5" />
								</div>

								{/* Card Content */}
								<div className="border rounded-lg p-4 bg-card/70 hover:bg-card transition-all space-y-2">
									<div className="flex flex-wrap items-start justify-between gap-2">
										<div className="space-y-1">
											<div className="flex flex-wrap items-center gap-2">
												<Badge
													variant="outline"
													className={cn(
														"text-xs font-semibold px-2 py-0.5 gap-1",
														config.color,
													)}
												>
													<Icon className="size-3" />
													{config.label}
												</Badge>

												{update.version && (
													<Badge
														variant="secondary"
														className="text-xs font-medium"
													>
														{update.version}
													</Badge>
												)}

												<div className="flex items-center gap-1.5">
													<Calendar className="size-3" />
													<span className="text-xs text-muted-foreground">
														{formatUpdateDate(update.createdAt)}
													</span>
												</div>
											</div>
										</div>

										{isMaker && (
											<DeleteUpdateButton updateId={update.id} />
										)}
									</div>

									<div className="space-y-1.5">
										<h4 className="font-bold text-base text-foreground">
											{update.title}
										</h4>
										<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
											{update.content}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

function DeleteUpdateButton({ updateId }: { updateId: number }) {
	const handleDelete = async () => {
		await deleteChangelogAction(updateId);
	};

	return (
		<DeleteConfirmDialog
			onConfirm={handleDelete}
			title="Delete Changelog Update?"
			description="This action cannot be undone. This will permanently remove this update entry from the project timeline."
			trigger={
				<Button
					variant="ghost"
					size="icon"
					className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
					title="Delete update"
				>
					<Trash2 className="size-3.5" />
				</Button>
			}
		/>
	);
}

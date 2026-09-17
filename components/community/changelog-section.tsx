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
	addChangelogAction,
	deleteChangelogAction,
} from "@/lib/community/community-actions";
import { cn } from "@/lib/utils";
import { ProductUpdateType } from "@/types";
import {
	Bug,
	Calendar,
	ChevronsUp,
	History,
	Loader2,
	Plus,
	Rocket,
	Send,
	Sparkles,
	Sunrise,
	Tag,
	Target,
	Trash2,
	Zap,
} from "lucide-react";
import React, { useActionState, useState } from "react";
import EmptyState from "../common/empty-state";

interface ChangelogSectionProps {
	productId: number;
	updates: ProductUpdateType[];
	isMaker: boolean;
	productName: string;
}

const CATEGORY_MAP = {
	feature: {
		label: "New Feature",
		icon: Sparkles,
		color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
		badgeClass: "bg-purple-500 text-white",
	},
	milestone: {
		label: "Milestone",
		icon: Target,
		color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		badgeClass: "bg-emerald-500 text-white",
	},
	improvement: {
		label: "Improvement",
		icon: Zap,
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		badgeClass: "bg-blue-500 text-white",
	},
	fix: {
		label: "Bug Fix",
		icon: Bug,
		color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
		badgeClass: "bg-rose-500 text-white",
	},
};

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
	const [selectedCategory, setSelectedCategory] = useState<
		"feature" | "milestone" | "improvement" | "fix"
	>("feature");

	const handlePostSubmit = async (formData: FormData) => {
		formData.set("productId", productId.toString());
		formData.set("category", selectedCategory);
		formAction(formData);
		if (!state.errors) {
			setIsOpen(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header & Post Button */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						{/* <Rocket className="size-5 text-primary" /> */}
						<h3 className="text-xl font-bold">Maker Changelog & Milestones</h3>
						{/* <Badge variant="secondary" className="text-xs">
							{updates.length}
						</Badge> */}
					</div>
					<p className="text-xs text-muted-foreground">
						Follow the journey, new features, and development progress of {productName}.
					</p>
				</div>

				{isMaker && (
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button size="sm" className="gap-2 shrink-0">
								<Plus className="size-4" />
								Post New Update
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-xl">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									{/* <ChevronsUp className="size-5 text-primary" /> */}
									Post Changelog / Milestone Update
								</DialogTitle>
								<DialogDescription>
									Share a release, progress milestone, or announcement with your community.
								</DialogDescription>
							</DialogHeader>

							<form action={handlePostSubmit} className="space-y-4 pt-2">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label htmlFor="version" className="text-xs font-semibold">
											Version / Tag (Optional)
										</Label>
										<div className="relative">
											<Tag className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
											<Input
												id="version"
												name="version"
												placeholder="e.g. v1.2.0, alpha-2"
												className="pl-8 text-sm"
											/>
										</div>
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
												const config = CATEGORY_MAP[cat];
												const isSelected = selectedCategory === cat;
												const Icon = config.icon;
												return (
													<button
														key={cat}
														type="button"
														onClick={() => setSelectedCategory(cat)}
														className={cn(
															"flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border cursor-pointer transition-all",
															isSelected
																? "bg-primary text-primary-foreground border-primary"
																: "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
														)}
													>
														<Icon className="size-3" />
														<span>{config.label}</span>
													</button>
												);
											})}
										</div>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="title" className="text-xs font-semibold">
										Update Headline *
									</Label>
									<Input
										id="title"
										name="title"
										placeholder="e.g., Launched AI Summary & Dark Mode"
										required
										className="text-sm"
									/>
									{state?.errors?.title && (
										<p className="text-xs text-destructive">
											{state.errors.title[0]}
										</p>
									)}
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="content" className="text-xs font-semibold">
										What changed? (Details & Notes) *
									</Label>
									<Textarea
										id="content"
										name="content"
										placeholder="Describe the new features, performance boosts, or milestone reached in detail..."
										rows={5}
										required
										className="text-sm resize-none"
									/>
									{state?.errors?.content && (
										<p className="text-xs text-destructive">
											{state.errors.content[0]}
										</p>
									)}
								</div>

								{state?.message && !state.success && (
									<p className="text-xs text-destructive">{state.message}</p>
								)}

								<div className="flex justify-end gap-2 pt-4 border-t">
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

			{/* Changelog Timeline */}
			{updates.length === 0 ? (
				<EmptyState
					header="No changelog updates posted yet"
					message={
						isMaker
							? "Keep your community engaged by publishing product milestones, bug fixes, and feature releases."
							: "The maker hasn't posted any development logs yet. Check back soon for new releases."
					}
				/>
			) : (
				<div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
					{updates.map((update) => {
						const catKey = (update.category || "feature") as keyof typeof CATEGORY_MAP;
						const catConfig = CATEGORY_MAP[catKey] || CATEGORY_MAP.feature;
						const Icon = catConfig.icon;

						return (
							<div key={update.id} className="relative group">
								{/* Timeline node icon */}
								<div className="absolute -left-6 sm:-left-8 top-1.5 size-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary shadow-xs">
									<Icon className="size-3.5" />
								</div>

								{/* Card Content */}
								<div className="border rounded-lg p-4 bg-card/70 hover:bg-card transition-all shadow-xs space-y-3">
									<div className="flex flex-wrap items-start justify-between gap-2">
										<div className="space-y-1">
											<div className="flex flex-wrap items-center gap-2">
												{update.version && (
													<Badge className="font-mono text-xs px-2 py-0.5">
														{update.version}
													</Badge>
												)}
												<Badge
													variant="outline"
													className={cn("px-2 py-0.5", catConfig.color)}
												>
													<Icon className="size-3 mr-1" />
													{catConfig.label}
												</Badge>
											</div>
											<h4 className="text-lg font-bold text-foreground">
												{update.title}
											</h4>
										</div>

										<div className="flex items-center gap-3">
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Calendar className="size-3" />
												<span>
													{new Intl.DateTimeFormat("en-US", {
														month: "short",
														day: "2-digit",
														year: "numeric",
													}).format(
														new Date(
															update.createdAt?.toISOString() ?? "",
														),
													)}
												</span>
											</div>

											{isMaker && (
												<DeleteUpdateButton updateId={update.id} />
											)}
										</div>
									</div>

									<div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pt-1 border-t border-border/40">
										{update.content}
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
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to remove this changelog update?"))
			return;
		setIsDeleting(true);
		await deleteChangelogAction(updateId);
		setIsDeleting(false);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleDelete}
			disabled={isDeleting}
			className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
		>
			<Trash2 className="size-3.5" />
		</Button>
	);
}

import BookmarksView from "@/components/bookmarks/bookmarks-view";
import SectionHeader from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import {
	getUserBookmarkLists,
	getUserBookmarks,
} from "@/lib/bookmarks/bookmark-select";
import { BookmarksSkeleton } from "@/components/skeleton";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "My Saved Tools & Bookmarks - BuildHub",
	description:
		"View and organize your bookmarked software products, personal testing lists, and private notes on BuildHub.",
};

export default function BookmarksPage() {
	return (
		<div className="pb-20 pt-4">
			<div className="wrapper space-y-6">
				<SectionHeader
					title="Saved Products & Playlists"
					description="Organize the software products and tools you want to test and review."
				/>

				<Suspense fallback={<BookmarksSkeleton />}>
					<BookmarksContent />
				</Suspense>
			</div>
		</div>
	);
}

async function BookmarksContent() {
	await connection();
	const { userId } = await auth();

	if (!userId) {
		return (
			<div className="rounded-lg h-65 border border-dashed border-border/80 bg-card/40 w-full text-center space-y-4 flex flex-col items-center justify-center">
				<div className="size-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
					<Lock className="size-6" />
				</div>
				<div className="space-y-1">
					<h2 className="text-xl font-bold tracking-tight">
						Save & Organize Products
					</h2>
					<p className="text-xs text-muted-foreground leading-relaxed">
						Sign in to save tools into custom playlists, add
						personal testing notes, and access your bookmarks across
						devices.
					</p>
				</div>
				<SignInButton mode="modal">
					<Button
						size="default"
						className="rounded-lg font-medium text-sm px-5"
					>
						Sign In to View Bookmarks
					</Button>
				</SignInButton>
			</div>
		);
	}

	const [userBookmarks, lists] = await Promise.all([
		getUserBookmarks(userId),
		getUserBookmarkLists(userId),
	]);

	return <BookmarksView initialBookmarks={userBookmarks} lists={lists} />;
}

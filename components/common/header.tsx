"use client";

import { AuthSkeleton, MobileAuthSkeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MAIN_NAV_ITEMS } from "@/lib/data/site-data";
import { cn } from "@/lib/utils";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	useAuth,
} from "@clerk/nextjs";
import { Fuel, LineDotRightHorizontal, Menu, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CustomUserButton from "./custom-user-button";

export const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2 group w-fit">
			<div className="size-8 rounded-lg bg-primary flex items-center justify-center">
				<Fuel className="size-4.5 text-primary-foreground" />
			</div>
			<span className="text-xl font-bold">
				Build<span className="text-primary">Hub</span>
			</span>
		</Link>
	);
};

export default function Header() {
	const pathname = usePathname();
	const { isLoaded } = useAuth();
	const [hasScrolled, setHasScrolled] = useState(false);
	const scrollThreshold = 20;

	useEffect(() => {
		const handleScroll = () => {
			setHasScrolled(window.scrollY > scrollThreshold);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
				hasScrolled && "border-b",
			)}
		>
			<div className="wrapper">
				<div className="flex h-16 items-center justify-between">
					<Logo />

					<nav className="hidden md:flex items-center gap-1.5">
						{MAIN_NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const isActive =
								item.href === "/"
									? pathname === "/"
									: pathname === item.href ||
										pathname.startsWith(`${item.href}/`);

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex rounded-md items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
										isActive
											? "bg-primary/10 text-primary font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
									)}
								>
									{Icon && (
										<Icon
											className={cn(
												"size-4 transition-colors",
												isActive
													? "text-primary"
													: "text-muted-foreground",
											)}
										/>
									)}
									{item.label}
								</Link>
							);
						})}
					</nav>

					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-3">
							{!isLoaded ? (
								<AuthSkeleton />
							) : (
								<>
									<SignedOut>
										<SignInButton mode="modal">
											<Button variant="ghost">
												Sign In
											</Button>
										</SignInButton>

										<SignUpButton mode="modal">
											<Button>Sign Up</Button>
										</SignUpButton>
									</SignedOut>

									<SignedIn>
										<Button asChild size="sm">
											<Link href="/submit">
												<SparklesIcon className="size-4" />
												Submit Project
											</Link>
										</Button>

										<CustomUserButton />
									</SignedIn>
								</>
							)}
						</div>

						<div className="md:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon">
										<Menu className="size-5" />
									</Button>
								</SheetTrigger>

								<SheetContent
									side="right"
									className="flex flex-col gap-6 pt-10 px-4"
								>
									<nav className="flex flex-col gap-1.5">
										{MAIN_NAV_ITEMS.map((item) => {
											const Icon = item.icon;
											const isActive =
												item.href === "/"
													? pathname === "/"
													: pathname === item.href ||
														pathname.startsWith(
															`${item.href}/`,
														);

											return (
												<Link
													key={item.href}
													href={item.href}
													className={cn(
														"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
														isActive
															? "bg-primary/10 text-primary font-medium"
															: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
													)}
												>
													{Icon && (
														<Icon
															className={cn(
																"size-4",
																isActive
																	? "text-primary"
																	: "text-muted-foreground",
															)}
														/>
													)}
													{item.label}
												</Link>
											);
										})}
									</nav>

									<div className="border-t pt-6 flex flex-col gap-3">
										{!isLoaded ? (
											<MobileAuthSkeleton />
										) : (
											<>
												<SignedOut>
													<SignInButton mode="modal">
														<Button variant="outline">
															Sign In
														</Button>
													</SignInButton>

													<SignUpButton mode="modal">
														<Button>Sign Up</Button>
													</SignUpButton>
												</SignedOut>

												<SignedIn>
													<Button asChild>
														<Link href="/submit">
															<SparklesIcon className="size-4" />
															Submit Project
														</Link>
													</Button>

													<div className="flex items-center justify-between">
														<p className="text-sm flex gap-1">
															Manage your account{" "}
															<LineDotRightHorizontal />
														</p>
														<CustomUserButton />
													</div>
												</SignedIn>
											</>
										)}
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

import Link from "next/link";
import { Logo } from "./header";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t bg-muted/5 py-12">
			<div className="wrapper">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="col-span-2">
						<Logo />
						<p className="text-muted-foreground text-sm max-w-xs pt-2">
							A community platform where creators share what
							they&apos;ve built and discover new launches.
						</p>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/explore"
								>
									Explore
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/explore?sort=trending"
								>
									Trending
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/submit"
								>
									Submit Project
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/about"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/contact"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-primary duration-300 transition-colors"
									href="/privacy"
								>
									Privacy
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; BuildHub Inc. {2026} | All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<Link
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary duration-300 transition-colors"
							aria-label="Twitter"
							href="https://x.com/@alokdotcom"
						>
							<Twitter className="size-5" />
						</Link>
						<Link
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary duration-300 transition-colors"
							aria-label="GitHub"
							href="https://github.com/alok-x0s1"
						>
							<Github className="size-5" />
						</Link>
						<Link
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary duration-300 transition-colors"
							aria-label="LinkedIn"
							href="https://linkedin.com/in/alok-x0s1"
						>
							<Linkedin className="size-5" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

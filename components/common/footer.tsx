import { FOOTER_SECTIONS, SOCIAL_LINKS } from "@/lib/data/site-data";
import Link from "next/link";
import CurrentYear from "./current-year";
import { Logo } from "./header";

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

					{FOOTER_SECTIONS.map((section) => (
						<div key={section.title}>
							<h3 className="font-semibold mb-4">{section.title}</h3>
							<ul className="space-y-3 text-sm text-muted-foreground">
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											className="hover:text-primary duration-300 transition-colors"
											href={link.href}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; BuildHub Inc. <CurrentYear /> | All rights reserved.
					</p>

					<div className="flex items-center gap-4">
						{SOCIAL_LINKS.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.label}
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary duration-300 transition-colors"
									aria-label={item.label}
									href={item.href}
								>
									<Icon className="size-5" />
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</footer>
	);
}

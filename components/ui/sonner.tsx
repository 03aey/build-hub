"use client";

import {
	AlertCircle,
	AlertTriangle,
	Bookmark,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			position="bottom-right"
			closeButton
			icons={{
				success: (
					<CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
				),
				info: <Bookmark className="size-4 text-primary shrink-0" />,
				warning: (
					<AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
				),
				error: (
					<AlertCircle className="size-4 text-destructive shrink-0" />
				),
				loading: (
					<Loader2 className="size-4 animate-spin text-primary shrink-0" />
				),
			}}
			style={
				{
					"--normal-bg": "var(--card)",
					"--normal-text": "var(--card-foreground)",
					"--normal-border": "var(--border)",
					"--success-bg": "var(--card)",
					"--success-text": "var(--card-foreground)",
					"--success-border": "var(--border)",
					"--error-bg": "var(--card)",
					"--error-text": "var(--card-foreground)",
					"--error-border": "var(--border)",
					"--info-bg": "var(--card)",
					"--info-text": "var(--card-foreground)",
					"--info-border": "var(--border)",
					"--warning-bg": "var(--card)",
					"--warning-text": "var(--card-foreground)",
					"--warning-border": "var(--border)",
					"--border-radius": "0.5rem",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:border group-[.toaster]:shadow-md group-[.toaster]:rounded-lg group-[.toaster]:font-sans group-[.toaster]:font-medium group-[.toaster]:p-3.5",
					title: "group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:text-foreground",
					description:
						"group-[.toast]:font-normal group-[.toast]:text-[11px] group-[.toast]:text-muted-foreground group-[.toast]:leading-relaxed group-[.toast]:mt-0.5",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:px-2.5 group-[.toast]:py-1",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:px-2.5 group-[.toast]:py-1",
					closeButton:
						"group-[.toast]:left-auto group-[.toast]:right-2.5 group-[.toast]:top-2.5 group-[.toast]:translate-x-0 group-[.toast]:translate-y-0 group-[.toast]:bg-card group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground group-[.toast]:border-border group-[.toast]:rounded-md group-[.toast]:transition-colors",
				},
			}}
			{...props}
		/>
	);
};

export { toast, Toaster };

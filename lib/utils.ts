import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a standard date (e.g., "Jan 12, 2026")
 */
export function formatDate(
	dateInput?: string | Date | null,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (!dateInput) return "";

	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (isNaN(date.getTime())) return "";

	const defaultOptions: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		year: "numeric",
	};

	return new Intl.DateTimeFormat("en-US", options ?? defaultOptions).format(date);
}

/**
 * Format an update / changelog date (e.g., "Jan 02, 2026")
 */
export function formatUpdateDate(dateInput?: string | Date | null): string {
	return formatDate(dateInput, {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}

/**
 * Relative time formatter (e.g., "Just now", "5m ago", "2h ago", "3d ago", or standard date)
 */
export function formatTimeAgo(dateInput?: string | Date | null): string {
	if (!dateInput) return "Just now";

	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (isNaN(date.getTime())) return "Just now";

	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours}h ago`;
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) return `${diffInDays}d ago`;

	return formatUpdateDate(date);
}

/**
 * Check if a given date is older than a specified number of months (default 6 months)
 */
export function isOlderThanMonths(
	dateInput?: string | Date | null,
	months: number = 6,
): boolean {
	if (!dateInput) return false;

	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (isNaN(date.getTime())) return false;

	const threshold = new Date();
	threshold.setMonth(threshold.getMonth() - months);
	return date <= threshold;
}

/**
 * Format numbers into compact units (e.g., 1200 -> "1.2K", 1000000 -> "1M")
 */
export function formatCompactNumber(num: number): string {
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		compactDisplay: "short",
	}).format(num);
}

/**
 * Truncate long text strings cleanly
 */
export function truncateText(text?: string | null, maxLength: number = 100): string {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Extract initials from a name (e.g., "Alok Singh" -> "AS")
 */
export function getInitials(name?: string | null): string {
	if (!name) return "U";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
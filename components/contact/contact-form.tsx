"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { contactSubmissionsAction } from "@/lib/contact/contact-actions";
import { cn } from "@/lib/utils";
import { FormState } from "@/types";
import { AlertCircle, CircleCheckBig, Loader2Icon, SendHorizonal } from "lucide-react";
import { useActionState, useState } from "react";
import { FormField } from "../form/form-field";
import { Label } from "../ui/label";

const contactReasons = [
	{ value: "become_admin", label: "Want to become admin" },
	{ value: "feature_request", label: "Feature request" },
	{ value: "bug_report", label: "Bug report" },
	{ value: "partnership", label: "Partnership inquiry" },
	{ value: "other", label: "Other inquiry" },
];

const initialState: FormState = {
	success: false,
	errors: undefined,
	message: "",
};

export function ContactForm() {
	const [reason, setReason] = useState("");
	const [state, formAction, isPending] = useActionState(
		contactSubmissionsAction,
		initialState,
	);

	const { errors, message, success } = state;
	const getFieldErrors = (fieldName: string): string[] => {
		if (!errors) return [];
		return (errors as Record<string, string[]>)[fieldName] ?? [];
	};

	if (success) {
		return (
			<Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5 shadow-none">
				<CardContent className="pt-6">
					<div className="text-center py-8 space-y-4">
						<CircleCheckBig className="size-8 md:size-10 text-muted-foreground/90 mx-auto" />
						<div className="space-y-2">
							<h3 className="text-2xl font-semibold">
								Thank You for Reaching Out!
							</h3>
							<p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
								{message ||
									"Your message has been sent successfully. We'll get back to you soon."}
							</p>
						</div>
						<Button
							onClick={() => window.location.reload()}
							className="mt-2"
						>
							Send Another Message
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	const reasonErrors = getFieldErrors("reason");

	return (
		<form action={formAction} className="space-y-6">
			{message && !success && (
				<div
					className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3"
					role="alert"
					aria-live="polite"
				>
					<AlertCircle className="size-5 shrink-0 mt-0.5" />
					<div className="space-y-1 text-sm">
						<p className="font-semibold">Message Submission Failed</p>
						<p className="text-xs opacity-90">{message}</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					label="Name"
					name="name"
					id="name"
					placeholder="Your full name"
					required
					error={getFieldErrors("name")}
				/>
				<FormField
					label="Email"
					name="email"
					id="email"
					placeholder="your.email@example.com"
					required
					error={getFieldErrors("email")}
				/>
			</div>

			<FormField
				label="Subject"
				name="subject"
				id="subject"
				placeholder="Brief summary of your inquiry"
				required
				helperText="Summarize your message in a few words"
				error={getFieldErrors("subject")}
			/>

			<FormField
				label="Description"
				name="description"
				id="description"
				placeholder="Provide relevant details, reproduction steps, or context..."
				required
				helperText="Provide comprehensive details to help us respond effectively"
				error={getFieldErrors("description")}
				textarea
			/>

			<input type="hidden" name="reason" value={reason} />

			<div className="space-y-1.5">
				<Label htmlFor="reason" className="text-sm font-medium">
					Reason for Contact <span className="text-destructive">*</span>
				</Label>

				<Select onValueChange={(value) => setReason(value)} value={reason}>
					<SelectTrigger
						className={cn(
							"w-full text-sm",
							reasonErrors.length > 0 &&
							"border-destructive focus:ring-destructive",
						)}
					>
						<SelectValue placeholder="Select a reason" />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							<SelectLabel>Contact Reason</SelectLabel>
							{contactReasons.map((r) => (
								<SelectItem key={r.value} value={r.value}>
									{r.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				{reasonErrors.length > 0 && (
					<div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
						<AlertCircle className="size-3.5 shrink-0" />
						<span>{reasonErrors.join(", ")}</span>
					</div>
				)}
			</div>

			<Button
				type="submit"
				size="lg"
				disabled={isPending}
				className="w-full font-semibold"
			>
				{isPending ? (
					<>
						<Loader2Icon className="size-4 animate-spin mr-2" />
						Sending Message...
					</>
				) : (
					<>
						<SendHorizonal className="size-4 mr-2" />
						Send Message
					</>
				)}
			</Button>
		</form>
	);
}

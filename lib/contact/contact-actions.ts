"use server";

import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { FormState } from "@/types";
import { auth } from "@clerk/nextjs/server";
import z from "zod";
import { contactSchema } from "./contact-validations";

export const contactSubmissionsAction = async (
	prevState: FormState,
	formData: FormData,
): Promise<FormState> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return {
				success: false,
				message: "You must be signed in to submit a contact inquiry.",
			};
		}

		const rawFormData = Object.fromEntries(formData.entries());
		const validatedData = contactSchema.safeParse(rawFormData);

		if (!validatedData.success) {
			return {
				success: false,
				errors: validatedData.error.flatten().fieldErrors,
				message: "Please correct the highlighted fields and try again.",
			};
		}

		const { name, email, subject, description, reason } = validatedData.data;

		await db.insert(contactSubmissions).values({
			name,
			email,
			subject,
			description,
			reason,
			status: "pending",
			userId,
			createdAt: new Date(),
		});

		return {
			success: true,
			message:
				"Your message has been sent successfully! Our team will get back to you shortly.",
		};
	} catch (error) {
		console.error("Error submitting contact inquiry:", error);

		if (error instanceof z.ZodError) {
			return {
				success: false,
				errors: error.flatten().fieldErrors,
				message: "Validation failed. Please check your form inputs.",
			};
		}

		return {
			success: false,
			message: "Failed to send message due to a server error. Please try again later.",
		};
	}
};

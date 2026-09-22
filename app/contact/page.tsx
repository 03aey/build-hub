import SectionHeader from "@/components/common/section-header";
import { ContactForm } from "@/components/contact/contact-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileQuestionMark } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us - BuildHub",
	description:
		"Get in touch with the BuildHub team. We'd love to hear from you!",
};

export default function ContactPage() {
	return (
		<div className="pb-20 pt-4">
			<div className="wrapper">
				<div className="mb-8">
					<SectionHeader
						title="Contact Us"
						description="Have questions, feedback, or want to contribute? We're here to help and would love to hear from you."
					/>
				</div>

				<div className="mb-8 max-w-3xl mx-auto">
					<ContactForm />
				</div>
				<div className="mb-4">
					<SectionHeader
						title="FAQ"
						icon={FileQuestionMark}
						description="Have any questions? We've got you covered."
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								How can I become an admin?
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Admin privileges are granted to active
								contributors who consistently help moderate and
								improve the platform. Start by contributing
								quality content and helping the community.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								How do I request a feature?
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Use the contact form above and select
								&quot;Feature request&quot; as your reason. We
								review all requests and prioritize based on
								community feedback and feasibility.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Can I report bugs?
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Absolutely! Select &quot;Bug report&quot; in the
								contact form and provide as much detail as
								possible about the issue you&apos;re
								experiencing.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Interested in partnerships?
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								We&apos;re always open to collaboration
								opportunities. Choose &quot;Partnership
								inquiry&quot; and tell us about your proposal.
							</CardDescription>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

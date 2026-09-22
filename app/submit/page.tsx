import SectionHeader from "@/components/common/section-header";
import ProductSubmitForm from "@/components/products/product-submit-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Submit Product - BuildHub",
	description:
		"Share your creation with the community. Your submission will be reviewed before going live.",
};

export default function SubmitPage() {
	return (
		<section className="pb-20 pt-4">
			<div className="wrapper">
				<div className="mb-8">
					<SectionHeader
						title="Submit Your Product"
						description="Share your creation with the community. Your submission will be reviewed before going live."
					/>
				</div>
				<div className="max-w-2xl mx-auto">
					<ProductSubmitForm />
				</div>
			</div>
		</section>
	);
}

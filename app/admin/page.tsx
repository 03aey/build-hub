import AdminProducts from "@/components/admin/admin-products";
import StatsCard from "@/components/admin/stats-card";
import SectionHeader from "@/components/common/section-header";
import { getAllProductsAdmin } from "@/lib/products/product-select";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Accessibility } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin Panel - BuildHub",
	description:
		"Secure admin dashboard for managing users, products, and platform settings. Review submissions, monitor analytics, and control system access.",
};

export default async function AdminPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const response = await clerkClient();
	const user = await response.users.getUser(userId!);

	const metadata = user.publicMetadata;
	const isAdmin = metadata?.isAdmin ?? false;

	if (!isAdmin) {
		redirect("/");
	}
	const allProducts = await getAllProductsAdmin();
	const approvedProducts = allProducts.filter(
		(product) => product.status === "approved",
	);

	const pendingProducts = allProducts.filter(
		(product) => product.status === "pending",
	);

	const rejectedProducts = allProducts.filter(
		(product) => product.status === "rejected",
	);
	return (
		<div className="py-20 pt-10">
			<div className="wrapper">
				<div className="mb-12">
					<SectionHeader
						title="Product Admin"
						icon={Accessibility}
						description="Review and manage submitted products"
					/>
				</div>
				<StatsCard
					approved={approvedProducts.length}
					pending={pendingProducts.length}
					rejected={rejectedProducts.length}
					all={allProducts.length}
				/>

				<AdminProducts
					products={pendingProducts}
					headerMessage={`Pending Products (${pendingProducts.length})`}
					emptyMessage="Congratulations! No pending products to review"
				/>
				<AdminProducts
					products={rejectedProducts}
					headerMessage={`Rejected Products (${rejectedProducts.length})`}
					emptyMessage="No products have been rejected yet"
				/>
				<AdminProducts
					products={approvedProducts}
					headerMessage={`Approved Products (${approvedProducts.length})`}
					emptyMessage="No products have been approved or submitted yet"
				/>
			</div>
		</div>
	);
}

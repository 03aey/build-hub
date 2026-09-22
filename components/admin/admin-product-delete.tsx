"use client";

import DeleteConfirmDialog from "@/components/common/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/lib/admin/admin-actions";
import { ProductType } from "@/types";
import { Trash2Icon } from "lucide-react";

export default function DeleteProduct({
	productId,
}: {
	productId: ProductType["id"];
}) {
	const handleDelete = async () => {
		await deleteProductAction(productId);
	};

	return (
		<DeleteConfirmDialog
			onConfirm={handleDelete}
			title="Are you sure you want to delete this product?"
			description="This action cannot be undone. This will permanently delete the product and all associated data."
			trigger={
				<Button variant="outline">
					<Trash2Icon className="size-4" />
					Delete
				</Button>
			}
		/>
	);
}

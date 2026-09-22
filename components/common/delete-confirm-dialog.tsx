"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface DeleteConfirmDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onConfirm: () => Promise<void> | void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	trigger?: React.ReactNode;
	disabled?: boolean;
}

export default function DeleteConfirmDialog({
	open: controlledOpen,
	onOpenChange: setControlledOpen,
	onConfirm,
	title = "Are you sure you want to delete?",
	description = "This action cannot be undone. This will permanently delete this item.",
	confirmText = "Delete",
	cancelText = "Cancel",
	trigger,
	disabled = false,
}: DeleteConfirmDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

	const handleConfirm = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			await onConfirm();
			setOpen(false);
		} catch (error) {
			console.error("Delete failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			{trigger && (
				<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			)}

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>
						{cancelText}
					</AlertDialogCancel>

					<AlertDialogAction
						onClick={handleConfirm}
						disabled={loading || disabled}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
					>
						{loading ? (
							<Loader2 className="size-3.5 animate-spin mr-1" />
						) : (
							<Trash2 className="size-3.5 mr-1" />
						)}
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

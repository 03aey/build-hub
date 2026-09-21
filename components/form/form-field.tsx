import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
	label: string;
	name: string;
	id: string;
	placeholder?: string;
	required: boolean;
	onChange?: (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => void;
	error?: string[];
	helperText?: string;
	textarea?: boolean;
	defaultValue?: string;
}

export const FormField = ({
	label,
	name,
	id,
	placeholder,
	required,
	onChange,
	error,
	helperText,
	textarea,
	defaultValue,
}: FormFieldProps) => {
	const hasError = Boolean(error && error.length > 0);

	return (
		<div className="space-y-1.5">
			<Label htmlFor={id} className="text-sm font-medium">
				{label} {required && <span className="text-destructive">*</span>}
			</Label>
			{textarea ? (
				<Textarea
					id={id}
					name={name}
					placeholder={placeholder}
					required={required}
					defaultValue={defaultValue}
					onChange={
						onChange as (
							e: React.ChangeEvent<HTMLTextAreaElement>
						) => void
					}
					className={cn(
						"min-h-24 resize-y text-sm",
						hasError && "border-destructive",
					)}
				/>
			) : (
				<Input
					id={id}
					name={name}
					placeholder={placeholder}
					required={required}
					defaultValue={defaultValue}
					onChange={
						onChange as (
							e: React.ChangeEvent<HTMLInputElement>
						) => void
					}
					className={cn(
						"text-sm",
						hasError && "border-destructive",
					)}
				/>
			)}
			{helperText && !hasError && (
				<p className="text-xs text-muted-foreground">{helperText}</p>
			)}
			{hasError && (
				<div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
					<AlertCircle className="size-3.5 shrink-0" />
					<span>{error!.join(", ")}</span>
				</div>
			)}
		</div>
	);
};

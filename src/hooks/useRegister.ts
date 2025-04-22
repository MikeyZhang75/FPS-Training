import { signUp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the register form schema
export const registerFormSchema = z.object({
	name: z.string().min(2, { message: "姓名必须至少2个字符" }),
	email: z.string().email({ message: "请输入正确的邮箱地址" }),
	password: z.string().min(6, { message: "密码必须至少6个字符" }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const useRegister = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const openDialog = useCallback(() => {
		setIsDialogOpen(true);
		// Reset form state when opening the dialog
		form.reset();
		setError(null);
	}, [form]);

	const closeDialog = useCallback(() => {
		setIsDialogOpen(false);
	}, []);

	const handleRegister = useCallback(
		async (values: RegisterFormValues) => {
			setIsLoading(true);
			setError(null);

			try {
				// Simulate API call with timeout
				const { error } = await signUp.email({
					email: values.email,
					password: values.password,
					name: values.name,
				});

				if (error) {
					setError("注册失败，该邮箱可能已被注册。");
					return;
				}

				// Mock successful registration
				console.log("注册成功:", values);
				toast.success("注册成功");

				// Show success message and close dialog only on success
				closeDialog();

				// In real app, you'd handle success here (auto login, redirect, etc.)
			} catch (err) {
				setError(err instanceof Error ? err.message : "注册失败。请重试。");
			} finally {
				setIsLoading(false);
			}
		},
		[closeDialog],
	);

	return {
		isDialogOpen,
		isLoading,
		error,
		form,
		openDialog,
		closeDialog,
		handleRegister,
	};
};

import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the login form schema
export const loginFormSchema = z.object({
	email: z.string().email({ message: "请输入正确的邮箱地址" }),
	password: z.string().min(6, { message: "密码必须至少6个字符" }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const useLogin = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
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

	const handleLogin = useCallback(
		async (values: LoginFormValues) => {
			setIsLoading(true);
			setError(null);

			try {
				// Simulate API call with timeout
				const { error } = await signIn.email({
					email: values.email,
					password: values.password,
				});

				if (error) {
					setError("登录失败，请检查您的凭据。");
					return;
				}

				// Mock successful login - replace with actual API call
				console.log("登录成功:", values);
				toast.success("登录成功");

				// Show success message or redirect - only close dialog on success
				closeDialog();

				// In real app, you'd handle success here (set auth state, redirect, etc.)
			} catch (err) {
				setError(err instanceof Error ? err.message : "登录失败。请重试。");
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
		handleLogin,
	};
};

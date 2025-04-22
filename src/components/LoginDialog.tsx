import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "@/hooks/useLogin";
import {
	IconEye,
	IconEyeOff,
	IconLoader2,
	IconLock,
	IconMail,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Extended schema for registration that includes name
export const registerFormSchema = z.object({
	name: z.string().min(2, { message: "姓名必须至少2个字符" }),
	email: z.string().email({ message: "请输入正确的邮箱地址" }),
	password: z.string().min(6, { message: "密码必须至少6个字符" }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface LoginDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: LoginFormValues) => Promise<void>;
	onRegister?: (values: RegisterFormValues) => Promise<void>;
	isLoading: boolean;
	error: string | null;
	form: UseFormReturn<LoginFormValues & Partial<{ name: string }>>;
}

type TabType = "login" | "register";

export function LoginDialog({
	isOpen,
	onClose,
	onSubmit,
	onRegister,
	isLoading,
	error,
	form,
}: LoginDialogProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("login");

	const handleSubmit = async (
		values: LoginFormValues & Partial<{ name: string }>,
	) => {
		if (activeTab === "login") {
			await onSubmit(values);
		} else if (activeTab === "register" && onRegister && values.name) {
			await onRegister({ ...values, name: values.name });
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-xl">
						{activeTab === "login" ? "登录到您的帐户" : "创建新帐户"}
					</DialogTitle>
				</DialogHeader>

				<div className="flex border-b mb-4">
					<button
						type="button"
						className={`flex-1 py-2 font-medium text-center ${
							activeTab === "login"
								? "text-primary border-b-2 border-primary"
								: "text-muted-foreground"
						}`}
						onClick={() => setActiveTab("login")}
					>
						登录
					</button>
					<button
						type="button"
						className={`flex-1 py-2 font-medium text-center ${
							activeTab === "register"
								? "text-primary border-b-2 border-primary"
								: "text-muted-foreground"
						}`}
						onClick={() => setActiveTab("register")}
					>
						注册
					</button>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4 py-2"
					>
						{error && (
							<div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
								{error}
							</div>
						)}

						{activeTab === "register" && (
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-2">
										<div className="relative">
											<IconUser className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
											<FormControl>
												<Input
													placeholder="您的姓名"
													className="pl-10"
													{...field}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<div className="relative">
										<IconMail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
										<FormControl>
											<Input
												placeholder="your.email@qq.com"
												className="pl-10"
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<div className="relative">
										<IconLock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
										<FormControl>
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												className="pl-10 pr-10"
												{...field}
											/>
										</FormControl>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-1 top-1 size-8"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<IconEyeOff className="size-4" />
											) : (
												<IconEye className="size-4" />
											)}
											<span className="sr-only">
												{showPassword ? "隐藏密码" : "显示密码"}
											</span>
										</Button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-between items-center">
							{activeTab === "login" ? (
								<Button variant="link" className="p-0 h-auto">
									忘记密码？
								</Button>
							) : (
								<div />
							)}
							<Button type="submit" disabled={isLoading}>
								{isLoading && (
									<IconLoader2 className="size-4 animate-spin [animation-duration:2s]" />
								)}
								{activeTab === "login" ? "登录" : "注册"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

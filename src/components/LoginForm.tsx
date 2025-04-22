import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "@/hooks/useLogin";
import { IconLoader2, IconLock, IconMail } from "@tabler/icons-react";
import type { UseFormReturn } from "react-hook-form";

interface LoginFormProps {
	form: UseFormReturn<LoginFormValues>;
	onSubmit: (values: LoginFormValues) => Promise<void>;
	isLoading: boolean;
	error: string | null;
}

export function LoginForm({
	form,
	onSubmit,
	isLoading,
	error,
}: LoginFormProps) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
				{error && (
					<div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
						{error}
					</div>
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
										type="password"
										placeholder="••••••••"
										className="pl-10 pr-10"
										{...field}
									/>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-between items-center">
					<Button variant="link" className="p-0 h-auto">
						忘记密码？
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && (
							<IconLoader2 className="size-4 animate-spin [animation-duration:2s]" />
						)}
						登录
					</Button>
				</div>
			</form>
		</Form>
	);
}

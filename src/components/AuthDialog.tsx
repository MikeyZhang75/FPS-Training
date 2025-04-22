import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { useState } from "react";

type TabType = "login" | "register";

interface AuthDialogProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
	const {
		isDialogOpen: isLoginOpen,
		isLoading: isLoginLoading,
		error: loginError,
		form: loginForm,
		closeDialog: closeLoginDialog,
		handleLogin: originalHandleLogin,
	} = useLogin();

	const {
		isLoading: isRegisterLoading,
		error: registerError,
		form: registerForm,
		handleRegister: originalHandleRegister,
	} = useRegister();

	const [activeTab, setActiveTab] = useState<TabType>("login");
	// Use the isOpen prop if provided, otherwise fall back to isLoginOpen
	const isDialogOpen = isOpen !== undefined ? isOpen : isLoginOpen;

	const handleClose = () => {
		// Call the onClose prop if provided, otherwise use the internal closeLoginDialog
		if (onClose) {
			onClose();
		} else {
			closeLoginDialog();
		}
		setActiveTab("login");
	};

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
	};

	// Custom handlers that ensure the dialog is closed only after successful login/register
	const handleLogin = async (
		values: Parameters<typeof originalHandleLogin>[0],
	) => {
		try {
			await originalHandleLogin(values);
			// Only close the parent dialog if the login was successful and we have an onClose prop
			// The original handler will only close its own dialog on success
			if (!loginError && onClose) {
				onClose();
			}
		} catch (error) {
			// If there's an error, don't close the dialog
			console.error("Login error:", error);
		}
	};

	const handleRegister = async (
		values: Parameters<typeof originalHandleRegister>[0],
	) => {
		try {
			await originalHandleRegister(values);
			// Only close the parent dialog if the registration was successful and we have an onClose prop
			// The original handler will only close its own dialog on success
			if (!registerError && onClose) {
				onClose();
			}
		} catch (error) {
			// If there's an error, don't close the dialog
			console.error("Registration error:", error);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleClose}>
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
						onClick={() => handleTabChange("login")}
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
						onClick={() => handleTabChange("register")}
					>
						注册
					</button>
				</div>

				{activeTab === "login" ? (
					<LoginForm
						form={loginForm}
						onSubmit={handleLogin}
						isLoading={isLoginLoading}
						error={loginError}
					/>
				) : (
					<RegisterForm
						form={registerForm}
						onSubmit={handleRegister}
						isLoading={isRegisterLoading}
						error={registerError}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

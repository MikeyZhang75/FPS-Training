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
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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

	// Refs for the tab buttons to measure their positions
	const loginTabRef = useRef<HTMLButtonElement>(null);
	const registerTabRef = useRef<HTMLButtonElement>(null);

	// Track the underline position and width based on active tab
	const [underlineStyle, setUnderlineStyle] = useState({
		width: 0,
		left: 0,
	});

	// Use useCallback to memoize the function so it doesn't change on every render
	const updateUnderlinePosition = useCallback(() => {
		const activeRef = activeTab === "login" ? loginTabRef : registerTabRef;
		if (activeRef.current) {
			const { width, left } = activeRef.current.getBoundingClientRect();
			const parentLeft =
				activeRef.current.parentElement?.getBoundingClientRect().left || 0;

			setUnderlineStyle({
				width,
				left: left - parentLeft,
			});
		}
	}, [activeTab]);

	// Update the underline position whenever the active tab changes
	useEffect(() => {
		// Initial positioning
		updateUnderlinePosition();

		// Also update on window resize to ensure correct positioning
		window.addEventListener("resize", updateUnderlinePosition);
		return () => window.removeEventListener("resize", updateUnderlinePosition);
	}, [updateUnderlinePosition]);

	// Update underline position when dialog is opened
	useEffect(() => {
		if (isDialogOpen) {
			// Use a small timeout to ensure DOM is fully rendered
			const timeoutId = setTimeout(() => {
				updateUnderlinePosition();
			}, 50);

			return () => clearTimeout(timeoutId);
		}
	}, [isDialogOpen, updateUnderlinePosition]);

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

	// Animation variants for tab content
	const tabContentVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			transition: {
				duration: 0.2,
				ease: "easeIn",
			},
		},
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-xl">
						{activeTab === "login" ? "登录到您的帐户" : "创建新帐户"}
					</DialogTitle>
				</DialogHeader>

				<div className="flex border-b mb-4 relative">
					<button
						ref={loginTabRef}
						type="button"
						className={`flex-1 py-2 font-medium text-center ${
							activeTab === "login" ? "text-primary" : "text-muted-foreground"
						}`}
						onClick={() => handleTabChange("login")}
					>
						登录
					</button>
					<button
						ref={registerTabRef}
						type="button"
						className={`flex-1 py-2 font-medium text-center ${
							activeTab === "register"
								? "text-primary"
								: "text-muted-foreground"
						}`}
						onClick={() => handleTabChange("register")}
					>
						注册
					</button>

					{/* Animated underline indicator */}
					<motion.div
						className="absolute bottom-0 h-0.5 bg-primary"
						initial={{ width: 0, left: 0, opacity: 0 }}
						animate={{
							width: underlineStyle.width,
							left: underlineStyle.left,
							opacity: underlineStyle.width > 0 ? 1 : 0,
						}}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
							duration: 0.3,
						}}
					/>
				</div>

				{/* Add a fixed height container to prevent layout shifts */}
				<div className="relative min-h-[200px]">
					<AnimatePresence mode="wait" initial={false}>
						{activeTab === "login" ? (
							<motion.div
								key="login"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={tabContentVariants}
								className="absolute w-full"
							>
								<LoginForm
									form={loginForm}
									onSubmit={handleLogin}
									isLoading={isLoginLoading}
									error={loginError}
								/>
							</motion.div>
						) : (
							<motion.div
								key="register"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={tabContentVariants}
								className="absolute w-full"
							>
								<RegisterForm
									form={registerForm}
									onSubmit={handleRegister}
									isLoading={isRegisterLoading}
									error={registerError}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	);
}

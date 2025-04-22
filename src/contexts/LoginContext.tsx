"use client";

import { type LoginFormValues, useLogin } from "@/hooks/useLogin";
import { type ReactNode, createContext, useContext } from "react";

interface LoginContextType {
	isDialogOpen: boolean;
	isLoading: boolean;
	error: string | null;
	openDialog: () => void;
	closeDialog: () => void;
	handleLogin: (values: LoginFormValues) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
	const loginState = useLogin();

	return (
		<LoginContext.Provider value={loginState}>{children}</LoginContext.Provider>
	);
}

export function useLoginContext() {
	const context = useContext(LoginContext);
	if (context === undefined) {
		throw new Error("useLoginContext must be used within a LoginProvider");
	}
	return context;
}

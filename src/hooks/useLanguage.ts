import { useCallback, useEffect, useState } from "react";

export type Language = "en" | "zh" | "fr" | "de" | "es";

interface LanguageOption {
	value: Language;
	label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
	{ value: "en", label: "English" },
	{ value: "zh", label: "中文" },
	{ value: "fr", label: "Français" },
	{ value: "de", label: "Deutsch" },
	{ value: "es", label: "Español" },
];

export const useLanguage = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [language, setLanguage] = useState<Language>("en");

	// Load language from localStorage on mount
	useEffect(() => {
		const savedLanguage = localStorage.getItem("language") as Language;
		if (
			savedLanguage &&
			LANGUAGE_OPTIONS.some((opt) => opt.value === savedLanguage)
		) {
			setLanguage(savedLanguage);
		}
	}, []);

	const changeLanguage = useCallback((newLanguage: Language) => {
		setLanguage(newLanguage);
		localStorage.setItem("language", newLanguage);
		setIsDialogOpen(false);
	}, []);

	const openDialog = useCallback(() => {
		setIsDialogOpen(true);
	}, []);

	const closeDialog = useCallback(() => {
		setIsDialogOpen(false);
	}, []);

	return {
		language,
		isDialogOpen,
		openDialog,
		closeDialog,
		changeLanguage,
	};
};
